import { useSelector } from 'react-redux'
export function Profile() {

    const userInfo = useSelector(state => state.user.info);

    return (
        <form>
            <div className="col-12">
                User Id {userInfo.userId}
            </div>
            <div className="row my-2">
                <div className="col-3">
                    <input type="text" className="form-control" placeholder="Name" />
                </div>

            </div>
            <div className="row">
                <div className="col-3">
                    <input type="text" className="form-control" placeholder="Gender" />
                </div>
            </div>
            <div className="row my-2">
                <div className="col-md-3">
                    <input type="password" className="form-control" placeholder="Password" />
                </div>

            </div>

            <div className="row">
                <div className="col-md-3">
                    <input type="password" className="form-control" placeholder="New Password" />
                </div>
            </div>
            <div className="row my-3">
                <div className="col-md-3">
                    <input type="password" className="form-control" placeholder="Confirm New Password" />
                </div>
            </div>
            <div className="row my-3">
                <div className="col-5">
                    <input type="text" className="form-control" placeholder="Phone" />
                </div>
            </div>
            <div className="row my-3">
                <div className="col-md-5">
                    <input type="email" className="form-control" placeholder="Email" />
                </div>
            </div>
            <div className="row my-3">
                <div className="col-3">
                    <input type="text" className="form-control" placeholder="Province" />
                </div>
            </div>
            <div className="row my-3">
                <div className="col-3">
                    <input type="text" className="form-control" placeholder="City" />
                </div>
            </div>
            <div className="row my-3">
                <div className="col-12">
                    <input type="text" className="form-control" placeholder="Address" />
                </div>
            </div>

            <div className="col-12 my-3 text-center">
                <button type="submit" className="btn btn-primary w-75">Update</button>
            </div>
        </form>
    );
}