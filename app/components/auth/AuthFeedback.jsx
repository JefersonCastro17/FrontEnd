export default function AuthFeedback({ feedback }) {
  if (!feedback?.message) return null;

  const typeClass = feedback.type === "success" ? "success" : "error";
  return <div className={`message ${typeClass}`}>{feedback.message}</div>;
}
