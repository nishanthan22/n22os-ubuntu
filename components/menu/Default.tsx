import React from "react";

interface DefaultMenuProps {
  active: boolean;
}

const DefaultMenu: React.FC<DefaultMenuProps> = ({ active }) => {
  return (
    <div
      id="default-menu"
      className={`${
        active ? "block" : "hidden"
      } cursor-default w-52 context-menu-bg border text-left border-gray-900 rounded text-white py-4 absolute z-50 text-sm`}
    >
      <Divider />
      <a
        rel="noreferrer noopener"
        href="https://www.linkedin.com/in/nishanth-ravichandran/"
        target="_blank"
        className="w-full block cursor-default py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5"
      >
        <span className="ml-5">🙋‍♂️</span> <span className="ml-2">Follow on <strong>LinkedIn</strong></span>
      </a>
      <a
        rel="noreferrer noopener"
        href="https://github.com/nishanthan22"
        target="_blank"
        className="w-full block cursor-default py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5"
      >
        <span className="ml-5">🤝</span> <span className="ml-2">Follow on <strong>GitHub</strong></span>
      </a>
      <a
        rel="noreferrer noopener"
        href="mailto:nishanthravi22@gmail.com"
        target="_blank"
        className="w-full block cursor-default py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5"
      >
        <span className="ml-5">📥</span> <span className="ml-2">Contact Me</span>
      </a>
      <Divider />
      <div
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
        className="w-full block cursor-default py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5"
      >
        <span className="ml-5">🧹</span> <span className="ml-2">Reset Ubuntu</span>
      </div>
    </div>
  );
};

const Divider: React.FC = () => (
  <div className="flex justify-center w-full">
    <div className="border-t border-gray-900 py-1 w-2/5"></div>
  </div>
);

export default DefaultMenu;
