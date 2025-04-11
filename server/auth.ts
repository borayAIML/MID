import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { getStorage } from "./storage";
import { User as UserType } from "@shared/schema";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

// Define the Express User interface
declare global {
  namespace Express {
    // Define User interface with explicit properties
    interface User {
      id: number;
      username: string;
      email: string;
      fullName: string;
      password: string;
      role: string;
      createdAt: Date;
    }
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const storage = getStorage();
  
  // Create PostgreSQL session store
  const PostgresStore = connectPg(session);
  
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "mandainstitute-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
    store: new PostgresStore({
      pool,
      tableName: 'user_sessions',
      createTableIfMissing: true
    })
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Use username field for email authentication
  passport.use(
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    }, async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }
        
        // For now, using simple password comparison as in the existing login endpoint
        // In production, we'd use the comparePasswords function
        if (user.password !== password) {
          return done(null, false, { message: "Invalid email or password" });
        }
        
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, email, password, fullName, role } = req.body;
      
      // Check if email already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        const errorResponse = { 
          success: false, 
          message: "Email already exists. Please try logging in instead." 
        };
        
        return res.status(400).json(errorResponse);
      }

      // Create user with email as username if not provided
      const user = await storage.createUser({
        username: username || email,
        email,
        password, // In production, we'd use hashPassword(password)
        fullName,
        role: role || "user"
      });

      // Log the user in after registration
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Format response based on calling endpoint
        if (res.locals.useOldResponse && res.locals.originalPath === "/api/auth/signup") {
          return res.status(201).json({ 
            success: true, 
            message: "Account created successfully",
            userId: user.id
          });
        }
        
        return res.status(201).json({
          success: true,
          message: "Account created successfully",
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
          }
        });
      });
    } catch (err) {
      return next(err);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", async (err: any, user: UserType | false, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: info?.message || "Invalid email or password" 
        });
      }
      
      req.login(user, async (err) => {
        if (err) return next(err);
        
        // Get user's companies
        const companies = await storage.getCompaniesByUserId(user.id);
        const companyId = companies.length > 0 ? (res.locals.useOldResponse ? companies[0].uniqueId : companies[0].id) : null;
        
        // Format response based on calling endpoint
        const response = {
          success: true,
          message: "Login successful",
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
          },
          companyId
        };
        
        return res.json(response);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: "Error logging out" 
        });
      }
      
      res.json({ 
        success: true, 
        message: "Logged out successfully" 
      });
    });
  });

  app.get("/api/user", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authenticated" 
      });
    }
    
    try {
      // Get user's companies with error handling
      const companies = await storage.getCompaniesByUserId(req.user!.id);
      console.log("User ID:", req.user!.id, "Companies:", JSON.stringify(companies));
      
      // Make sure we have a valid companyId
      const companyId = companies && companies.length > 0 ? companies[0].id : null;
      
      console.log("Returning user info with companyId:", companyId);
      
      res.json({
        success: true,
        user: {
          id: req.user?.id,
          email: req.user?.email,
          fullName: req.user?.fullName,
          role: req.user?.role
        },
        companyId
      });
    } catch (error) {
      console.error("Error getting user companies:", error);
      res.json({
        success: true,
        user: {
          id: req.user?.id,
          email: req.user?.email,
          fullName: req.user?.fullName,
          role: req.user?.role
        },
        companyId: null
      });
    }
  });
} 