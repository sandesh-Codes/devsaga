export default function SectionBlock({ title, children }) {
 return (
    <div className="border p-4 rounded-lg">
        <h3 className="font-bold mb-2">{title}</h3>
        <div>{children}</div>
    </div>
 )   
}