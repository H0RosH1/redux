import Select from "react-select";
import PropTypes from "prop-types";

export default function DropdownSearch({ data, handbleChange, campaigns }) {
  // const handleChange = (selectedOption) => {
  //   setCampaigns(selectedOption);
  // };

  return (
    <Select
      className="sm:w-5/6"
      defaultValue={campaigns}
      onChange={handbleChange}
      options={data}
      isMulti
    />
  );
}

DropdownSearch.propTypes = {
  data: PropTypes.array.isRequired,
  handbleChange: PropTypes.func.isRequired,
  campaigns: PropTypes.array.isRequired,
};