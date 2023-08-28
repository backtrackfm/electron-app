import React, { useState } from "react";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";

const maxTags = 5;

export function TagInput() {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ",") {
      event.preventDefault(); // Prevent typing a comma in the input
      addTagsFromInput();
    }
  };

  const addTagsFromInput = () => {
    if (tags.length >= 5) return;

    const newTags = inputValue
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    newTags.forEach((newTag) => {
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
    });

    setInputValue("");
  };

  const handleTagClick = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className="flex flex-col gap-3">
      <Input
        type="text"
        placeholder="Enter tags"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
      />
      <div className="flex gap-2">
        {tags.map((tag, index) => (
          <Badge
            variant="default"
            key={index}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
