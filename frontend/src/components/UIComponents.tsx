// UIComponents.tsx
import { type ReactNode } from "react";
import styles from "../css/Tax.module.css"

// ---------------- Card Components ----------------
export const Card = ({ children }: { children: ReactNode }) => (
  <div className={styles.card}>{children}</div>
);

export const CardHeader = ({ children }: { children: ReactNode }) => (
  <div className={styles.cardHeader}>{children}</div>
);

export const CardTitle = ({ children }: { children: ReactNode }) => (
  <h3 className={styles.cardTitle}>{children}</h3>
);

export const CardDescription = ({ children }: { children: ReactNode }) => (
  <p className={styles.cardDescription}>{children}</p>
);

export const CardContent = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={`${styles.cardContent} ${className || ""}`}>{children}</div>
);

// ---------------- Button Component ----------------
interface ButtonProps {
  children: ReactNode;
  variant?: "default" | "outline";
  size?: "default" | "sm";
  className?: string;
  onClick?: () => void;
}
export const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}: ButtonProps) => (
  <button
    className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

// ---------------- Input & Label ----------------
export const Input = ({ id, type = "text", placeholder }: { id: string; type?: string; placeholder: string }) => (
  <input id={id} type={type} placeholder={placeholder} className={styles.input} />
);

export const Label = ({ htmlFor, children }: { htmlFor: string; children: string }) => (
  <label htmlFor={htmlFor} className={styles.label}>
    {children}
  </label>
);

// ---------------- Badge ----------------
interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning";
}
export const Badge = ({ children, variant = "default" }: BadgeProps) => (
  <span className={`${styles.badge} ${styles[`badge-${variant}`]}`}>{children}</span>
);

// ---------------- Progress ----------------
export const Progress = ({ value }: { value: number }) => (
  <div className={styles.progress}>
    <div className={styles.progressBar} style={{ width: `${value}%` }}></div>
  </div>
);

// ---------------- Table Components ----------------
export const Table = ({ children }: { children: ReactNode }) => <table className={styles.table}>{children}</table>;
export const TableHeader = ({ children }: { children: ReactNode }) => <thead className={styles.tableHeader}>{children}</thead>;
export const TableBody = ({ children }: { children: ReactNode }) => <tbody>{children}</tbody>;
export const TableRow = ({ children }: { children: ReactNode }) => <tr className={styles.tableRow}>{children}</tr>;
export const TableHead = ({ children }: { children: ReactNode }) => <th className={styles.tableHead}>{children}</th>;
export const TableCell = ({ children, className }: { children: ReactNode; className?: string }) => (
  <td className={`${styles.tableCell} ${className || ""}`}>{children}</td>
);


// ---------------- Select Components ----------------
export const Select = ({ children }: { children: ReactNode }) => <div className={styles.select}>{children}</div>;
export const SelectTrigger = ({ children }: { children: ReactNode }) => <div className={styles.selectTrigger}>{children}</div>;
export const SelectContent = ({ children }: { children: ReactNode }) => <div className={styles.selectContent}>{children}</div>;
export const SelectItem = ({ value, children }: { value: string; children: string }) => (
  <div className={styles.selectItem} data-value={value}>
    {children}
  </div>
);
export const SelectValue = ({ placeholder }: { placeholder: string }) => <span className={styles.selectValue}>{placeholder}</span>;

// ---------------- Icons ----------------
export const UploadIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24">
    <path d="M11 15h2v-3h3l-4-4-4 4h3z" />
    <path d="M20 18H4v-7h2v5h12v-5h2z" />
  </svg>
);

export const DownloadIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24">
    <path d="M11 15h2v-3h3l-4-4-4 4h3z" />
    <path d="M20 18H4v-7h2v5h12v-5h2z" />
  </svg>
);

export const AlertTriangleIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24">
    <path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 4v4h2v-4h-2zm0 6v2h2v-2h-2z" />
  </svg>
);

export const CheckCircleIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

export const CalculatorIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-2h2v2zm0-4H7v-2h2v2zm0-4H7V7h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zm4 8h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </svg>
);
