import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { getIndustries, getSubcategoriesForIndustry } from "@/lib/benchmarkService";
import { Industry, IndustrySubcategory } from "@shared/industries";

export interface IndustrySelectionData {
  industryId: string;
  subcategoryId?: string;
}

interface IndustrySelectorProps {
  initialValue?: IndustrySelectionData;
  onChange?: (selection: IndustrySelectionData) => void;
  className?: string;
}

export function IndustrySelector({
  initialValue,
  onChange,
  className = ""
}: IndustrySelectorProps) {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [subcategories, setSubcategories] = useState<IndustrySubcategory[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>(initialValue?.industryId || "");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(initialValue?.subcategoryId || "none");

  // Load industries on component mount
  useEffect(() => {
    const loadIndustries = () => {
      const industryData = getIndustries();
      setIndustries(industryData);
    };
    
    loadIndustries();
  }, []);

  // Load subcategories when industry selection changes
  useEffect(() => {
    if (selectedIndustry) {
      const subcategoryData = getSubcategoriesForIndustry(selectedIndustry);
      setSubcategories(subcategoryData);
      
      // Reset subcategory selection if not valid for new industry
      const isCurrentSubcategoryValid = selectedSubcategory === "none" || 
                                       subcategoryData.some(s => s.id === selectedSubcategory);
      if (!isCurrentSubcategoryValid) {
        setSelectedSubcategory("none");
      }
      
      // Update parent component
      if (onChange) {
        onChange({ 
          industryId: selectedIndustry, 
          subcategoryId: selectedSubcategory === "none" ? undefined : selectedSubcategory 
        });
      }
    } else {
      setSubcategories([]);
      setSelectedSubcategory("none");
      
      // Update parent component
      if (onChange) {
        onChange({ industryId: "" });
      }
    }
  }, [selectedIndustry]);

  // Notify parent when subcategory changes
  useEffect(() => {
    if (onChange && selectedIndustry) {
      onChange({
        industryId: selectedIndustry,
        subcategoryId: selectedSubcategory === "none" ? undefined : selectedSubcategory
      });
    }
  }, [selectedSubcategory]);

  const handleIndustryChange = (value: string) => {
    setSelectedIndustry(value);
  };

  const handleSubcategoryChange = (value: string) => {
    setSelectedSubcategory(value);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Select
          value={selectedIndustry}
          onValueChange={handleIndustryChange}
        >
          <SelectTrigger id="industry">
            <SelectValue placeholder="Select your industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Industries</SelectLabel>
              {industries.map((industry) => (
                <SelectItem key={industry.id} value={industry.id}>
                  {industry.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      {selectedIndustry && subcategories.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="subcategory">Subcategory</Label>
          <Select
            value={selectedSubcategory}
            onValueChange={handleSubcategoryChange}
          >
            <SelectTrigger id="subcategory">
              <SelectValue placeholder="Select a subcategory (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Subcategories</SelectLabel>
                <SelectItem value="none">No specific subcategory</SelectItem>
                {subcategories.map((subcategory) => (
                  <SelectItem key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Selecting a more specific subcategory will provide more accurate benchmark data
          </p>
        </div>
      )}
    </div>
  );
}

export function IndustryDetail({
  industryId,
  subcategoryId
}: {
  industryId: string;
  subcategoryId?: string;
}) {
  const [industryName, setIndustryName] = useState<string>("");
  const [subcategoryName, setSubcategoryName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (!industryId) return;
    
    const industries = getIndustries();
    const industry = industries.find(i => i.id === industryId);
    
    if (industry) {
      setIndustryName(industry.name);
      
      if (subcategoryId) {
        const subcategory = industry.subcategories.find(s => s.id === subcategoryId);
        if (subcategory) {
          setSubcategoryName(subcategory.name);
          setDescription(subcategory.description);
        } else {
          setSubcategoryName("");
          setDescription(industry.description);
        }
      } else {
        setSubcategoryName("");
        setDescription(industry.description);
      }
    }
  }, [industryId, subcategoryId]);
  
  if (!industryId || !industryName) return null;

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-medium text-lg">
          {industryName}
          {subcategoryName && <span className="text-muted-foreground"> / {subcategoryName}</span>}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}