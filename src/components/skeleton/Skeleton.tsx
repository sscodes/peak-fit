import classes from "./Skeleton.module.css";

const Skeleton = ({ height }: { height: string }) => {
  return <div className={classes.skeleton} style={{ height: height }}></div>;
};

export default Skeleton;
