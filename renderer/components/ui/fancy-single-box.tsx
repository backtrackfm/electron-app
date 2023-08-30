// A version of the fancy-box but only single item

"use client";

import { Check, ChevronsUpDown, Edit2 } from "lucide-react";
import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";

// FIXME: https://twitter.com/lemcii/status/1659649371162419202?s=46&t=gqNnMIjMWXiG2Rbrr5gT6g
// Removing states would help maybe?

type Framework = Record<"value" | "label", string>;

const FRAMEWORKS = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
  {
    value: "wordpress",
    label: "WordPress",
  },
] satisfies Framework[];

export function FancySingleBox() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [frameworks, setFrameworks] = React.useState<Framework[]>(FRAMEWORKS);
  const [openCombobox, setOpenCombobox] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [selectedValue, setSelectedValue] = React.useState<Framework | null>(
    FRAMEWORKS[0]
  );

  const createFramework = (name: string) => {
    const newFramework = {
      value: name.toLowerCase(),
      label: name,
    };
    setFrameworks((prev) => [...prev, newFramework]);
    setSelectedValue(newFramework);
  };

  const toggleFramework = (framework: Framework) => {
    setSelectedValue((currentFrameworks) => framework);
    inputRef?.current?.focus();
  };

  const updateFramework = (framework: Framework, newFramework: Framework) => {
    setFrameworks((prev) =>
      prev.map((f) => (f.value === framework.value ? newFramework : f))
    );
    setSelectedValue(framework);
  };

  const deleteFramework = (framework: Framework) => {
    setFrameworks((prev) => prev.filter((f) => f.value !== framework.value));
    setSelectedValue(null);
  };

  const onComboboxOpenChange = (value: boolean) => {
    inputRef.current?.blur(); // HACK: otherwise, would scroll automatically to the bottom of page
    setOpenCombobox(value);
  };

  return (
    <div className="max-w-[200px]">
      <Popover open={openCombobox} onOpenChange={onComboboxOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCombobox}
            className="w-[200px] justify-between text-foreground"
          >
            {selectedValue === null && "Select labels"}
            {selectedValue && selectedValue.label}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command loop>
            <CommandInput
              ref={inputRef}
              placeholder="Search framework..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandGroup className="max-h-[145px] overflow-auto">
              {frameworks.map((framework) => {
                const isActive = selectedValue === framework;
                return (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={() => toggleFramework(framework)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isActive ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex-1">{framework.label}</div>
                  </CommandItem>
                );
              })}
              <CommandItemCreate
                onSelect={() => createFramework(inputValue)}
                {...{ inputValue, frameworks }}
              />
            </CommandGroup>
            <CommandSeparator alwaysRender />
            <CommandGroup>
              <CommandItem
                value={`:${inputValue}:`} // HACK: that way, the edit button will always be shown
                className="text-xs text-muted-foreground"
                onSelect={() => setOpenDialog(true)}
              >
                <div className={cn("mr-2 h-4 w-4")} />
                <Edit2 className="mr-2 h-2.5 w-2.5" />
                Edit Labels
              </CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          if (!open) {
            setOpenCombobox(true);
          }
          setOpenDialog(open);
        }}
      >
        <DialogContent className="max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Labels</DialogTitle>
            <DialogDescription>
              Change the label names or delete the labels. Create a label
              through the combobox though.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-scroll -mx-6 px-6 flex-1 py-2">
            {frameworks.map((framework) => {
              return (
                <DialogListItem
                  key={framework.value}
                  onDelete={() => deleteFramework(framework)}
                  onSubmit={(e) => {
                    e.preventDefault();
                    const target = e.target as typeof e.target &
                      Record<"name", { value: string }>;
                    const newFramework = {
                      value: target.name.value.toLowerCase(),
                      label: target.name.value,
                    };
                    updateFramework(framework, newFramework);
                  }}
                  {...framework}
                />
              );
            })}
          </div>
          <DialogFooter className="bg-opacity-40">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const CommandItemCreate = ({
  inputValue,
  frameworks,
  onSelect,
}: {
  inputValue: string;
  frameworks: Framework[];
  onSelect: () => void;
}) => {
  const hasNoFramework = !frameworks
    .map(({ value }) => value)
    .includes(`${inputValue.toLowerCase()}`);

  const render = inputValue !== "" && hasNoFramework;

  if (!render) return null;

  // BUG: whenever a space is appended, the Create-Button will not be shown.
  return (
    <CommandItem
      key={`${inputValue}`}
      value={`${inputValue}`}
      className="text-xs text-muted-foreground"
      onSelect={onSelect}
    >
      <div className={cn("mr-2 h-4 w-4")} />
      Create new label &quot;{inputValue}&quot;
    </CommandItem>
  );
};

const DialogListItem = ({
  value,
  label,
  onSubmit,
  onDelete,
}: Framework & {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onDelete: () => void;
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [accordionValue, setAccordionValue] = React.useState<string>("");
  const [inputValue, setInputValue] = React.useState<string>(label);
  const disabled = label === inputValue;

  React.useEffect(() => {
    if (accordionValue !== "") {
      inputRef.current?.focus();
    }
  }, [accordionValue]);

  return (
    <Accordion
      key={value}
      type="single"
      collapsible
      value={accordionValue}
      onValueChange={setAccordionValue}
    >
      <AccordionItem value={value}>
        <div className="flex justify-between items-center">
          <div>{label}</div>
          <div className="flex items-center gap-4">
            <AccordionTrigger>Edit</AccordionTrigger>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                {/* REMINDER: size="xs" */}
                <Button variant="destructive" size="xs">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You are about to delete the label {label}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <AccordionContent>
          <form
            className="flex items-end gap-4"
            onSubmit={(e) => {
              onSubmit(e);
              setAccordionValue("");
            }}
          >
            <div className="w-full gap-3 grid">
              <Label htmlFor="name">Label name</Label>
              <Input
                ref={inputRef}
                id="name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="h-8"
              />
            </div>
            {/* REMINDER: size="xs" */}
            <Button type="submit" disabled={disabled} size="xs">
              Save
            </Button>
          </form>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
