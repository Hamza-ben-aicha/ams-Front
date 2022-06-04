import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../../api/index.js";
import { UserContext } from "../../context/userContext.js";
const EntProjects = () => {
  const [projectsTable, setProjectsTable] = useState([
    // {id : "" , date_deb : "" , date_fin : ""}
  ]);
  const [consultant, setConsultant] = useState([]);
  const [normes, setNormes] = useState([]);
  let index = 0;

  const decode = useContext(UserContext);
  const curentUser = JSON.parse(localStorage.getItem("curentUser"));

  useEffect(() => {
    API.get(`getPE/${curentUser?.user?.subInfo?.id}`)
      .then((result) => {
        setProjectsTable(result?.data?.projects);
        setConsultant(result?.data?.consultantsName);
        setNormes(result?.data?.Normes);
      })
      .catch((err) => {
        console.log("err");
      });
  }, []);

  return (
    <div className="container" style={{ marginTop: "20px" }}>
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Nom consultant</th>
            <th scope="col">Norme</th>
            <th scope="col">Date debut</th>
            <th scope="col">date Fin</th>
            <th scope="col">View</th>
          </tr>
        </thead>
        <tbody>
          {projectsTable.length > 0 ? (
            projectsTable.length === 1 ? (
              <tr key={projectsTable[0]?.id}>
                <td className="tableCell"> {consultant[index]}</td>
                <td className="tableCell">
                  {normes[index]}
                  {/* <span hidden>{index++}</span> */}
                </td>
                <td className="tableCell">{projectsTable[0]?.date_deb}</td>
                <td className="tableCell">{projectsTable[0]?.date_fin}</td>
                <td className="tableCell">
                  <Link
                    to={`/projet/${projectsTable[0]?.id}/${consultant[index]}/${curentUser?.user?.username}/${projectsTable[0]?.date_deb}/${projectsTable[0]?.date_fin}`}

                    // to={`/user_entreprise/${projectsTable[0]?.id}`}
                    style={{ textDecoration: "none" }}
                    className="btn btn-outline-dark"
                  >
                    <div className="viewButton">View</div>
                  </Link>
                </td>
              </tr>
            ) : (
              projectsTable?.map((project) => (
                <tr key={project?.id}>
                  <td className="tableCell">{consultant[index]}</td>
                  <td className="tableCell">
                    {normes[index]}
                  </td>
                  <td className="tableCell">{project?.date_deb}</td>
                  <td className="tableCell">{project?.date_fin}</td>
                  <td className="tableCell">
                    <Link
                      to={`/profile/projet/${project?.id}/${consultant[index]}/${curentUser?.user?.username}/${project?.date_deb}/${project?.date_fin}`}
                      // to={`/profile/projet/${project?.id}`}
                      className="btn btn-outline-dark"
                    >
                      view
                    </Link>
                  </td>
                  <span hidden>{index++}</span>
                </tr>
              ))
            )
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No Data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EntProjects;
