export function Logo({ text = "Chat"}) {

    return (
        <div className="d-flex align-items-center justify-content-center fs-2 p-3" style={{ width: 100, height: 60, borderRadius: "50%", backgroundColor: "#3398DB", color: "#fff" }}>
            {text}
        </div>
    );
}