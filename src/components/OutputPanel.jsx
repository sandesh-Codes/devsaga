import SectionBlock from "./SectionBlock";
import CopyButton from "./CopyButton";

export default function OutputPanel({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-4">
      <SectionBlock title="Root Cause">{data.rootCause}</SectionBlock>
      <SectionBlock title="Explanation">{data.explanation}</SectionBlock>
      <SectionBlock title="Fix Steps">
        <ul className="list-disc ml-5">
          {data.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
          
        </ul>
      </SectionBlock>
      <SectionBlock title="Fixed Code">
        <CopyButton text={data.fixedCode} />
        <pre className="bg-gray-100 p-2 mt-2 overflow-x-auto">{data.fixedCode}</pre>
      </SectionBlock>
      <SectionBlock title="Common Mistakes">
        <ul className="list-disc ml-5">
          {data.mistakes.map((mistake, i) => (
            <li key={i}>{mistake}</li>
          ))}
        </ul>
      </SectionBlock>
    </div>
  );
}
