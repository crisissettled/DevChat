import logo from '../../asset/images/logo.svg'
export function Logo({ text = "Chat", width = 100}) {
    return (
        <div className={`d-flex align-items-center justify-content-center`} >
            <img src={logo} alt={text} width={width} />
        </div>
    );
}