import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";

interface Props {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  loading: boolean;
  threshold: number;
  onThresholdChange: (val: number) => void;
}

export default function TextPrompt({
  value,
  onChange,
  onSubmit,
  loading,
  threshold,
  onThresholdChange,
}: Props) {
  const isDisabled = loading || value.trim() === "";

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Label htmlFor="prompt">Prompt</Label>
        <div className="flex gap-2">
          <Input
            id="prompt"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. 'a red apple', 'mountain peak'"
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && !isDisabled && onSubmit()}
          />
          <Button 
            onClick={onSubmit} 
            disabled={isDisabled} 
            className="gap-2 bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Segment
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Confidence Threshold</Label>
          <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
            {(threshold ?? 0.5).toFixed(2)}
          </span>
        </div>
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={[threshold ?? 0.5]}
          onValueChange={(val) => {
            if (Array.isArray(val) && val.length > 0) {
              onThresholdChange(val[0]);
            } else if (typeof val === "number") {
              onThresholdChange(val);
            }
          }}
          className="py-4"
        />
        <p className="text-[10px] text-muted-foreground">
          Higher values result in more precise but potentially smaller masks.
        </p>
      </div>
    </div>
  );
}
