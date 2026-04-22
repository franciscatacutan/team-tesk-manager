import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { Checkbox } from "@/components/ui/checkbox";

interface FilterGroup {
  key: string;
  label: string;
  type?: "single" | "multi";
  options: { label: string; value: string }[];
}

interface Props {
  config: FilterGroup[];

  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

export function FilterPopover({ config, values, onChange }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="h-10 px-4 rounded-xl border bg-background hover:bg-muted/40">
          Filter
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-fit p-4">
        <Accordion type="multiple" defaultValue={config.map((c) => c.key)}>
          {config.map((group) => (
            <AccordionItem key={group.key} value={group.key}>
              <AccordionTrigger className="text-sm font-medium">
                {group.label}
              </AccordionTrigger>

              <AccordionContent className="space-y-2">
                {group.options.map((opt) => {
                  const checked = values[group.key] === opt.value;

                  return (
                    <div key={opt.value} className="flex items-center gap-2">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => onChange(group.key, opt.value)}
                      />
                      <span className="text-sm">{opt.label}</span>
                    </div>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </PopoverContent>
    </Popover>
  );
}
