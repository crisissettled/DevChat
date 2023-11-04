import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from "react-hook-form"

import { getUserInfo } from '../app/User/userSlice'
import { Gender } from '../utils/Constants'

export function Profile() {
    const user = useSelector(state => state.user);
    const dispach = useDispatch();
    const { register, handleSubmit } = useForm()

    useEffect(() => {
        dispach(getUserInfo(user.userId))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (user.data === null) return <div>No data available.</div>

    const onSubmit = (data) => console.log(data)

    const { name, gender, phone, email, province, city, address } = user.data;

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
                        <input {...register("name")} value={name ?? ""} placeholder="Name" className="form-control" />
                    </div> <div className="col-2">
                        <select {...register("gender")} value={gender} placeholder="gender" className="form-control">
                            <option value="2">Female</option>
                            <option value="1">Male</option>
                            <option value="0">Unknown</option>
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
                        <input {...register("phone")} value={phone ?? ""} placeholder="phone" className="form-control" />
                    </div>
                </div>
                <div className="row my-2">
                    <div className="col-5">
                        <input {...register("email")} value={email ?? ""} placeholder="email" className="form-control" />
                    </div>
                </div>
            </section>
            <section>
                <h5>Area</h5>
                <div className="row my-2">
                    <div className="col-3">
                        <input {...register("province")} value={province ?? ""} placeholder="province" className="form-control" />
                    </div>
                </div>
                <div className="row my-2">
                    <div className="col-3">
                        <input {...register("city")} value={city ?? ""} placeholder="city" className="form-control" />
                    </div>
                </div>
                <div className="row my-2">
                    <div className="col-6">
                        <input {...register("address")} value={address ?? ""} placeholder="address" className="form-control" />
                    </div>
                </div>
            </section>
            <div className="row my-2">
                <div className="col-3">
                    <input type="submit" className="btn btn-primary" />
                </div>
            </div>
        </form >

    );
}