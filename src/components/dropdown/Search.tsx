const Search = ({ placeholder, ...props }: { placeholder: string }) => {
  return (
    <div className="sticky top-0 z-10 p-2 bg-inherit">
      <input
        type="text"
        placeholder={placeholder}
        className="text-sm font-medium placeholder:text-text4 py-[12px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer border-strock text-text1"
        {...props}
      />
    </div>
  );
};

export default Search;