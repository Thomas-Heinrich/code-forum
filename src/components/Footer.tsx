const linkStyle = 'no-underline! text-black w-fit';

function footer() {
  return (
    <div className="flex flex-row bg-neutral-300 p-15 w-full">
      <div className="flex flex-col w-[80%] m-auto">
        <a className={linkStyle} href="/impressum">
          Impressum
        </a>
      </div>
    </div>
  );
}

export default footer;
