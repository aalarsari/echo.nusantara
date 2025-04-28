import { useDebouncedCallback } from "use-debounce";
import { useRouter } from "next/navigation";

interface SearchInputProps {
  isSearchOpen: boolean;
  searchInputRef: React.RefObject<HTMLDivElement>;
  onSearch: (term: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  isSearchOpen,
  searchInputRef,
  onSearch,
}) => {
  return (
    isSearchOpen && (
      <div
        ref={searchInputRef}
        className="absolute right-0 top-full mt-2 w-[15rem]"
      >
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full rounded-md border border-[#C1AE94] px-3 py-2 text-sm outline-none focus:border-[#C1AE94] focus:outline-none"
        />
      </div>
    )
  );
};
