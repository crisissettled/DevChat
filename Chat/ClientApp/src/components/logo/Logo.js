export function Logo({ text = "Chat", width = 100, height = 60, fontSzie = "fs-2"}) {

    return (
        <div className={`d-flex align-items-center justify-content-center ${fontSzie } p-3 `}  style={{ width, height, borderRadius: "50%", backgroundColor: "#3398DB", color: "#fff" }}>
            {text}
        </div>
    );
}