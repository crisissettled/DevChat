import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from "react-hook-form"

import { getUserInfo, updateUserInfo } from '../app/User/userSlice'
import { FetchStatus } from '../utils/Constants';


export function Profile() {
    const user = useSelector(state => state.user);
    const dispach = useDispatch();
    const { register, handleSubmit, reset } = useForm({ defaultValues: user.data });

    useEffect(() => {
        dispach(getUserInfo(user.userId))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        reset(user.data)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.data])

    const onSubmit = (data) => {
        dispach(updateUserInfo({ ...data, gender: +data.gender }));
    }

    console.log(user.status,"user.state")

    return (

        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row my-2">
                <div className="col-3">
                    <h2>{user.userId}</h2>
                </div>
            </div>
            <section>
                <h5>User Info</h5>
                <div className="row my-2">
                    <div className="col-3">
                        <input {...register("name")} placeholder="Name" className="form-control" />
                    </div> <div className="col-2">
                        <select {...register("gender")} placeholder="gender" className="form-control">
                            <option value="0">NotSet</option>
                            <option value="1">Male</option>
                            <option value="2">Female</option>
                            <option value="3">Unknown</option>
                        </select>
                    </div>
                </div>
            </section>
            <section>
                <h5>Security</h5>
                <div className="row my-2">
                    <div className="col-md-3">
                        <input type="password" {...register("password")} className="form-control" placeholder="Password" />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-3">
                        <input type="password" {...register("newPassword")} className="form-control" placeholder="New Password" />
                    </div>
                </div>
                <div className="row my-3">
                    <div className="col-md-3">
                        <input type="password" {...register("confirmPassword")} className="form-control" placeholder="Confirm New Password" />
                    </div>
                </div>
            </section>
            <section>
                <h5>Contact Info</h5>
                <div className="row my-2">
                    <div className="col-3">
                        <input {...register("phone")} placeholder="phone" className="form-control" />
                    </div>
                </div>
                <div className="row my-2">
                    <div className="col-5">
                        <input {...register("email")} placeholder="email" className="form-control" />
                    </div>
                </div>
            </section>
            <section>
                <h5>Area</h5>
                <div className="row my-2">
                    <div className="col-3">
                        <input {...register("province")} placeholder="province" className="form-control" />
                    </div>
                </div>
                <div className="row my-2">
                    <div className="col-3">
                        <input {...register("city")} placeholder="city" className="form-control" />
                    </div>
                </div>
                <div className="row my-2">
                    <div className="col-6">
                        <input {...register("address")} placeholder="address" className="form-control" />
                    </div>
                </div>
            </section>
            <div className="row my-2">
                <div className="col-3">
                    {user.status === FetchStatus.PENDING ? <h5>Updating...</h5> : <input type="submit" className="btn btn-primary" />}
                </div>
            </div>
        </form >

    );
}