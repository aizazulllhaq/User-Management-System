import React, { useEffect, useState } from "react";
import Navbar from "../../../Layouts/Navbar";
import axios from "axios";

const View = () => {
  const [profileImage, setProfileImage] = useState("");
  const [username, setUsername] = useState("");
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("");
  const [isData, SetIsData] = useState(true);

  const Attendence = "Present";
  const AttendenceStyling = `text-center align-baseline inline-flex px-4 py-3 mr-auto items-center font-semibold text-[.95rem] leading-none text-primary bg-primary-light rounded-lg ${
    Attendence === "Present"
      ? "bg-green-600 hover:bg-green-900 text-white"
      : "bg-gray-600 hover:bg-gray-900 text-white"
  }`;

  useEffect(() => {
    const getUserDetail = async () => {
      try {
        const response = await axios.get("http://localhost:8080/profile/view", {
          withCredentials: true,
        });

        if (!response.data.data) return SetIsData(false);

        if (isData) {
          setUsername(response.data.data[0].username);
          setProfileImage(response.data.data[0].profileAvatar);
          setAttendanceDate(
            response.data.data[0].attendanceDetails.records[0].date
              .split("T")[0]
              .replace(/-/g, " ")
          );
          setAttendanceStatus(
            response.data.data[0].attendanceDetails.records[0].status
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    getUserDetail();
  }, []);

  return (
    <>
      <Navbar path="loggedIn" />

      <div className="flex flex-wrap -mx-3 mb-5">
        <div className="w-full max-w-full px-3 mb-6  mx-auto">
          <div className="relative flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] bg-gray-100 m-5">
            <div className="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30">
              {/* card header */}
              <div className="px-9 pt-5 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent">
                <h3 className="flex flex-col items-start justify-center m-2 ml-0 font-medium text-xl/tight text-dark">
                  <span className="mr-3 font-semibold text-dark text-3xl">
                    Student View
                  </span>
                  {!isData && "There no attendance found"}
                </h3>
              </div>
              {/* end card header */}
              {/* card body  */}
              <div className="flex-auto block py-8 pt-6 px-9">
                <div className="overflow-x-auto">
                  <table className="w-full my-0 align-middle text-dark border-neutral-200">
                    <thead className="align-bottom">
                      <tr className="font-semibold text-[0.95rem] text-secondary-dark">
                        <th className="pb-3 text-start min-w-[175px]">
                          Profile Image
                        </th>
                        <th className="pb-3 text-center min-w-[100px]">Name</th>
                        <th className="pb-3 text-center min-w-[100px]">Date</th>
                        <th className="pb-3 pr-12 text-center min-w-[175px]">
                          Attendence
                        </th>
                      </tr>
                    </thead>
                    {isData && (
                      <tbody>
                        <tr className="border-b border-dashed last:border-b-0">
                          <td className="p-3 pl-0">
                            <div className="flex items-center">
                              <div className="relative inline-block shrink-0 rounded-2xl me-3">
                                <img
                                  src={profileImage}
                                  className="w-16 h-16 inline-block shrink-0 rounded-2xl"
                                  alt="loading..."
                                />
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <span className="font-semibold text-light-inverse text-md/normal">
                              {username}
                            </span>
                          </td>
                          <td className="p-3 pr-0 text-center">
                            <span>{attendanceDate}</span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={AttendenceStyling}>
                              {attendanceStatus}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    )}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default View;
