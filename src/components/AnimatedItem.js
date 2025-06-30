import { motion } from "framer-motion";

function AnimatedItem({ children, tag = "div", ...rest }) {
  const MotionTag = motion(tag);
  return (
    <MotionTag
      layout  // 👈 これを追加！！
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

export default AnimatedItem;