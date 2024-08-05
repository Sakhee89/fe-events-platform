import Spinner from "./Spinner";

const Loading = () => {
  return (
    <div className=" flex items-center justify-center">
      <Spinner customStyle="animate-spin" w="48" h="48" />
    </div>
  );
};

export default Loading;
