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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { FilterGroup } from "@/common/types/filter.types";
import { Check, Filter, RotateCcw, X } from "lucide-react";

type FilterValues = Record<string, string | string[] | undefined>;

interface Props {
  config: FilterGroup[];
  values: FilterValues;
  label?: string;
  align?: "start" | "center" | "end";
  className?: string;
  onChange: (key: string, value: string | string[]) => void;
  onClear?: () => void;
}

function getValueArray(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getActiveOptions(config: FilterGroup[], values: FilterValues) {
  return config.flatMap((group) => {
    const selectedValues = new Set(getValueArray(values[group.key]));

    return group.options
      .filter((option) => !option.isDefault)
      .filter((option) => selectedValues.has(option.value))
      .map((option) => ({
        groupKey: group.key,
        groupType: group.type ?? "single",
        label: option.label,
        value: option.value,
      }));
  });
}

function getActiveGroupCount(group: FilterGroup, values: FilterValues) {
  const selectedValues = new Set(getValueArray(values[group.key]));

  return group.options.filter(
    (option) => !option.isDefault && selectedValues.has(option.value),
  ).length;
}

export function FilterPopover({
  config,
  values,
  label = "Filter",
  align = "end",
  className,
  onChange,
  onClear,
}: Props) {
  const activeOptions = getActiveOptions(config, values);
  const activeCount = activeOptions.length;
  const defaultOpenGroups = config.map((group) => group.key);

  const clearGroup = (group: FilterGroup) => {
    onChange(group.key, group.type === "multi" ? [] : "");
  };

  const clearAll = () => {
    if (onClear) {
      onClear();
      return;
    }

    config.forEach(clearGroup);
  };

  const clearOption = (
    groupKey: string,
    groupType: "single" | "multi",
    optionValue: string,
  ) => {
    if (groupType === "single") {
      onChange(groupKey, "");
      return;
    }

    onChange(
      groupKey,
      getValueArray(values[groupKey]).filter((value) => value !== optionValue),
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-10 justify-between gap-2 rounded-xl border-border/70 bg-background px-3 shadow-none hover:bg-muted/50",
            className,
          )}
        >
          <span className="inline-flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {label}
          </span>

          {activeCount > 0 && (
            <Badge
              variant="secondary"
              className="h-5 min-w-5 rounded-full px-1.5 text-[11px]"
            >
              {activeCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align={align} className="w-80 overflow-hidden p-0">
        <div className="border-b border-border/60 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Filters
              </h2>
              <p className="text-xs text-muted-foreground">
                Refine this list without leaving the page.
              </p>
            </div>

            {activeCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={clearAll}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>

          {activeCount > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {activeOptions.map((option) => (
                <button
                  key={`${option.groupKey}-${option.value}`}
                  type="button"
                  onClick={() =>
                    clearOption(
                      option.groupKey,
                      option.groupType,
                      option.value,
                    )
                  }
                  className="inline-flex h-7 items-center gap-1 rounded-full border border-border/70 bg-muted/45 px-2 text-xs font-medium text-foreground transition hover:bg-muted"
                >
                  {option.label}
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
        </div>

        <Accordion
          type="multiple"
          defaultValue={defaultOpenGroups}
          className="max-h-[22rem] overflow-y-auto px-2 py-1"
        >
          {config.map((group) => (
            <AccordionItem
              key={group.key}
              value={group.key}
              className="border-border/50"
            >
              <AccordionTrigger className="px-2 py-3 text-sm font-medium hover:no-underline">
                <span className="flex items-center gap-2">
                  {group.label}
                  {getActiveGroupCount(group, values) > 0 && (
                    <Badge variant="outline" className="h-5 rounded-full px-1.5">
                      {getActiveGroupCount(group, values)}
                    </Badge>
                  )}
                </span>
              </AccordionTrigger>

              <AccordionContent className="px-1 pb-3">
                <div className="space-y-1">
                {group.options.map((opt) => {
                  const groupType = group.type ?? "single";
                  const selectedValues = getValueArray(values[group.key]);
                  const checked = selectedValues.includes(opt.value);

                  const toggleOption = () => {
                    if (groupType === "single") {
                      onChange(group.key, opt.value);
                      return;
                    }

                    onChange(
                      group.key,
                      checked
                        ? selectedValues.filter((value) => value !== opt.value)
                        : [...selectedValues, opt.value],
                    );
                  };

                  return (
                    <div
                      key={opt.value}
                      role="button"
                      tabIndex={0}
                      onClick={toggleOption}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          toggleOption();
                        }
                      }}
                      className={cn(
                        "flex h-9 w-full cursor-pointer items-center justify-between rounded-lg px-2.5 text-left text-sm transition outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                        checked
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted/60",
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        {groupType === "multi" && (
                          <Checkbox
                            checked={checked}
                            tabIndex={-1}
                            className="pointer-events-none"
                            aria-hidden="true"
                          />
                        )}
                        <span className="truncate">{opt.label}</span>
                      </span>

                      {groupType === "single" && checked && (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                  );
                })}
                </div>

                {getActiveGroupCount(group, values) > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2 h-8 w-full justify-start px-2 text-xs text-muted-foreground"
                    onClick={() => clearGroup(group)}
                  >
                    Clear {group.label.toLowerCase()}
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </PopoverContent>
    </Popover>
  );
}
