import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { mysqlip } from '../components/ip';

type Project = {
  id: number;
  Title: string;
  Img_path: string;
  Descr: string;
  Content: string;
  Author: string;
  created_at: number;
};

function Home() {
  // --- States ---
  const [data, setData] = useState<Project[]>([]);
  const [blogload, setBlogload] = useState(true);
  const navigate = useNavigate();

  // --- useEffect ---
  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch(
          'http://' + mysqlip + ':4000/api/3Projects',
        );
        const projects: Project[] = await response.json();

        setData(projects);
        setBlogload(false);
      } catch (err) {
        console.error(err);
      }
    }

    loadProjects();
  }, []);

  return (
    <div>
      <div className="flex justify-center items-center w-full h-screen bg-radial to-neutral-950 from-red-700">
        <div className="w-[90%] sm:w-[80%] text-white">
          <h1>Willkommen</h1>
          <h4 className="text-sm! md:text-xl!">
            Hier beginnt dein Coding Abenteuer! Tausche dich mit anderen aus
            oder lerne etwas neues.
          </h4>
        </div>
      </div>
      <div className="w-[90%] sm:w-[80%] m-auto pt-4">
        <div className="flex flex-col justify-center">
          <h1>Latest Tutorials</h1>
          <hr />
          <div className="flex flex-col mb-4">
            {blogload ? (
              <p>Lade Tutorials...</p>
            ) : (
              data.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/project/${project.Title}`)}
                  className="flex flex-col justify-between cursor-pointer mt-4 bg-gray-300 border overflow-hidden border-gray-900 rounded h-full max-w-none group/1"
                >
                  {project.Img_path && (
                    <img
                      src={'/user_img/' + project.Img_path}
                      alt=""
                      className="aspect-video max-h-125 object-cover rounded-t mb-2"
                      onError={(e) => {
                        e.currentTarget.src = '/user_img/defult.png';
                      }}
                    />
                  )}
                  <div className='p-4'>
                    <h2>{project.Title}</h2>
                    <ReactMarkdown>{project.Descr}</ReactMarkdown>
                    <div className="p-px  w-full bg-gray-400 transition duration-500 group-hover/1:bg-red-400"></div>
                    <div className="flex mt-2 flex-row justify-between m-auto w-full">
                      <p>{project.Author}</p>
                      <p>
                        {project?.created_at &&
                          new Date(project.created_at).toLocaleDateString(
                            'de-DE',
                          )}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
