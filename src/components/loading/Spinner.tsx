type Props = {
  w?: string;
  h?: string;
  customStyle?: string;
};
const Spinner = ({ w = "24", h = "24", customStyle }: Props) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={w}
        height={h}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`lucide lucide-loader-2 ${customStyle}`}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </>
  );
};

export default Spinner;
