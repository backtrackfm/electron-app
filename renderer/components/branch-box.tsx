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
import { Branch } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";

// FIXME: https://twitter.com/lemcii/status/1659649371162419202?s=46&t=gqNnMIjMWXiG2Rbrr5gT6g
// Removing states would help maybe?

type BranchBoxItem = {
  name: string; // this is just the name, e.g. original. this is also used as id
  description?: string;
};

type BranchBoxProps = {
  branches: Branch[];
  branch: string | null;
  setBranch(branch: string): void;
  onCreate(branchItem: BranchBoxItem): void;
  onDelete(branchItem: BranchBoxItem): void;
  onEdit(oldBranchItem: BranchBoxItem, branchItem: BranchBoxItem): void;
};

export function BranchBox(props: BranchBoxProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [branchItems, setBranchItems] = React.useState<BranchBoxItem[]>(
    props.branches.map((it) => {
      return {
        name: it.name,
        description: it.description,
      };
    })
  );
  const [openCombobox, setOpenCombobox] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  // const [selectedValue, setSelectedValue] =
  //   React.useState<BranchBoxItem | null>(null);

  console.log(branchItems);

  const createBranchItem = (name: string) => {
    const newBranchItem: BranchBoxItem = {
      name: name.toLowerCase(),
    };

    setBranchItems((prev) => [...prev, newBranchItem]);
    props.setBranch(newBranchItem.name);
    props.onCreate(newBranchItem);
  };

  const toggleBranchItem = (branchItem: BranchBoxItem) => {
    props.setBranch(branchItem.name);
    inputRef?.current?.focus();
  };

  const updateBranchItem = (
    branchItem: BranchBoxItem,
    newBranchItem: BranchBoxItem
  ) => {
    setBranchItems((prev) =>
      prev.map((f) => (f === branchItem ? newBranchItem : f))
    );

    // When we update the branch, the name might change
    props.setBranch(newBranchItem.name);

    props.onEdit(branchItem, newBranchItem);
  };

  const deleteBranchItem = (branchItem: BranchBoxItem) => {
    setBranchItems((prev) => prev.filter((f) => f !== branchItem));

    props.setBranch(null);
    props.onDelete(branchItem);
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
            {props.branch === null && "Select branch"}
            {props.branch && props.branch}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command loop>
            <CommandInput
              ref={inputRef}
              placeholder="Search branch..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandGroup className="max-h-[145px] overflow-auto">
              {branchItems.map((branchItem) => {
                const isActive = props.branch === branchItem.name;
                return (
                  <CommandItem
                    key={branchItem.name}
                    value={branchItem.name}
                    onSelect={() => toggleBranchItem(branchItem)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isActive ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex-1">{branchItem.name}</div>
                  </CommandItem>
                );
              })}
              <CommandItemCreate
                onSelect={() => createBranchItem(inputValue)}
                {...{ inputValue, branchItems }}
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
                Edit Branches
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
            <DialogTitle>Edit Branches</DialogTitle>
            <DialogDescription>
              Delete or modify branches on this project
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-scroll -mx-6 px-6 flex-1 py-2">
            {branchItems.map((branchItem) => {
              return (
                <DialogListItem
                  key={branchItem.name}
                  onDelete={() => deleteBranchItem(branchItem)}
                  onSubmit={(e, name, description) => {
                    e.preventDefault();
                    console.log(name, description);
                    updateBranchItem(branchItem, {
                      name: name.toLowerCase(),
                      description,
                    });
                  }}
                  item={branchItem}
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
  branchItems,
  onSelect,
}: {
  inputValue: string;
  branchItems: BranchBoxItem[];
  onSelect: () => void;
}) => {
  const hasNoBranchItem =
    branchItems.findIndex((it) => it.name === inputValue.toLowerCase()) === -1;

  const render = inputValue !== "" && hasNoBranchItem;

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
      Create new branch &quot;{inputValue}&quot;
    </CommandItem>
  );
};

const DialogListItem = ({
  item,
  onSubmit,
  onDelete,
}: {
  item: BranchBoxItem;
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    name: string,
    description: string
  ) => void;
  onDelete: () => void;
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const [accordionValue, setAccordionValue] = React.useState<string>("");
  const [inputValue, setInputValue] = React.useState<string>(item.name);
  const [descriptionInputValue, setDescriptionInputValue] =
    React.useState<string>(item.description);

  const disabled =
    item.name === inputValue && item.description === descriptionInputValue;

  React.useEffect(() => {
    if (accordionValue !== "") {
      inputRef.current?.focus();
    }
  }, [accordionValue]);

  return (
    <Accordion
      key={item.name}
      type="single"
      collapsible
      value={accordionValue}
      onValueChange={setAccordionValue}
    >
      <AccordionItem value={item.name}>
        <div className="flex justify-between items-center">
          <div>{item.name}</div>
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
                    You are about to delete the branch {item.name}.
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
              onSubmit(e, inputValue, descriptionInputValue);
              setAccordionValue("");
            }}
          >
            <div className="w-full gap-3 grid">
              <Label htmlFor="name">Branch</Label>
              <Input
                ref={inputRef}
                id="name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="h-8"
              />

              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                className="h-8"
                value={descriptionInputValue}
                onChange={(e) => setDescriptionInputValue(e.target.value)}
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
