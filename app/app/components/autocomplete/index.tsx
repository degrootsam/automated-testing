import classNames from "classnames";
import TextField, { TextFieldProps } from "../textfield";
import React, { useEffect, useRef, useState } from "react";
import { Option } from "~/utils/types";
import { filterOptions } from "~/utils";

export interface AutocompleteProps extends TextFieldProps {
  textfieldClassName?: TextFieldProps["className"];
  options: Option[];
  /** Triggered when the user types in the textfield, can be delayed with debounce option */
  onSearchChange: (value: string) => void;
  /** Delay (in ms) before onSearchChange is triggered */
  debounce?: number;
}

export default function Autocomplete({
  className,
  textfieldClassName,
  options,
  onSearchChange,
  name,
  value = "",
  debounce = 0,
  ...props
}: AutocompleteProps) {
  const [search, setSearch] = useState<string>("");
  const [currentValue, setCurrentValue] = useState<string>(value.toString());
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  const containerRef = useRef<HTMLDivElement>(null);

  const onBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (
      event.relatedTarget != null &&
      containerRef.current?.contains(event.relatedTarget as Node)
    ) {
      return;
    }
    setShowOptions(false);
  };

  const onFocus = () => {
    setShowOptions(true);
  };

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { dataset } = event.currentTarget;

    const value = dataset.value;
    const label = dataset.label;

    if (!value || !label) return;

    setCurrentValue(value);

    setSearch(label);

    setShowOptions(false);
  };

  const OptionComponent = ({ option }: { option: Option }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full py-2 px-4 flex flex-row hover:bg-base-200"
        data-value={option.value}
        data-label={option.label}
      >
        {option.label}
      </button>
    );
  };

  useEffect(() => {
    setFilteredOptions(filterOptions(options, search));

    const timer = setTimeout(() => {
      onSearchChange(search);
    }, debounce);
    return () => clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSearch(value);
  };

  return (
    <div
      ref={containerRef}
      className={classNames(className)}
      onBlur={onBlur}
      onFocus={onFocus}
      tabIndex={-1}
    >
      <input type="hidden" name={name} value={currentValue} />
      <TextField
        {...props}
        className={classNames("w-full", textfieldClassName)}
        onChange={onChangeSearch}
        value={search}
      >
        Test
      </TextField>
      {showOptions && (
        <div className="relative">
          <div className="absolute pt-2 z-10 bg-base-100 w-full border-l border-r border-b border-neutral">
            <p className="text-xs opacity-30 mx-2">Choose an option:</p>
            {filteredOptions.map((option) => (
              <OptionComponent option={option} key={option.value} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
