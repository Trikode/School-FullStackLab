import { motion } from 'framer-motion';
export function TransitionElement({ children }) {
  return (
    <motion.div
      initial={{ y: 8, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.15 }}>
      {children}
    </motion.div>
  );
}
