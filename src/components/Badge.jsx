export default function Badge({ text }) {
  return (
    <span style={{
      background: "#8b6f5a",
      color: "white",
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "12px"
    }}>
      {text}
    </span>
  );
}