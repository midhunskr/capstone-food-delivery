import PropTypes from "prop-types";

export const GroupComponent = ({
  className = "",
  playStoreIcon,
  playStoreSeparator,
}) => {
  return (
    <div
      className={`shadow-[0px_19px_40.6px_-24px_rgba(0,_0,_0,_0.66)] rounded-mini bg-bg-white flex flex-row items-end justify-start p-[1.062rem] box-border gap-[1.125rem] min-w-[6.813rem] z-[1] text-center text-[1.038rem] text-dark font-quicksand ${className}`}
    >
      <div className="h-[4.75rem] w-[10.438rem] relative shadow-[0px_19px_40.6px_-24px_rgba(0,_0,_0,_0.66)] rounded-mini bg-bg-white hidden" />
      <img
        className="h-[2.581rem] w-[2.375rem] relative z-[1]"
        loading="lazy"
        alt=""
        src={playStoreIcon}
      />
      <div className="flex-1 flex flex-col items-end justify-start gap-[0.193rem]">
        <img
          className="self-stretch h-[0.806rem] relative max-w-full overflow-hidden shrink-0 object-cover z-[1]"
          alt=""
          src="/rating-stars@2x.png"
        />
        <div className="self-stretch flex flex-row items-start justify-end py-[0rem] pl-[1rem] pr-[0.875rem]">
          <b className="flex-1 relative leading-[1.125rem] inline-block min-w-[2.769rem] shrink-0 z-[1]">
            {playStoreSeparator}
          </b>
        </div>
      </div>
    </div>
  );
};

GroupComponent.propTypes = {
  className: PropTypes.string,
  playStoreIcon: PropTypes.string,
  playStoreSeparator: PropTypes.string,
};