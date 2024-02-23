import React, { useState, useEffect, useRef } from 'react';
import "./DropdownWithAdd.css";

function DropdownWithAdd({ fetchItems, addItem, deleteItem, onChange }) {
  const [items, setItems] = useState([]);
  const [showAddNew, setShowAddNew] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("Select an option");
  const dropdownRef = useRef(null); // Ref to help detect clicks outside

  // Fetch items from the database
  useEffect(() => {
    fetchItems().then(setItems);
  }, [fetchItems]);

  // Detect clicks outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false); // Close the dropdown
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);

  const handleSelectItem = (itemId) => {
    const selectedItem = items.find(item => item.id === itemId);
    if (selectedItem) {
      setSelectedLabel(selectedItem.label); // Update the label state
      onChange(itemId); // Notify parent component about the selection
    }
    setIsDropdownVisible(false); // Close the dropdown
  };

  const handleAddNewItem = async () => {
    if (newItem.trim() === '') {
      alert('Please enter a valid item name.');
      return;
    }
  
    try {
      await addItem(newItem);
      setNewItem(''); // Reset the input field after successful addition
      setShowAddNew(false); // Optionally close the add new item input
      fetchItems().then(setItems); // Refresh the list with the new item
    } catch (error) {
      console.error("Error adding new item:", error);
      alert('Failed to add the item. Please try again.');
    }
  };
  
  const handleShowAddNew = () => {
    setShowAddNew(true);
    setIsDropdownVisible(false); // Optionally close the dropdown when showing the add new input
  };

  const handleDeleteItem = async (itemId, event) => {
    event.stopPropagation(); // Prevent the dropdown from closing
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (confirmed) {
      await deleteItem(itemId);
      fetchItems().then(setItems); // Refresh the items list
    }
  };


  return (
    <div className="dropdownWithAdd" ref={dropdownRef}>
      <div className="dropdownToggle" onClick={toggleDropdown}>
        {selectedLabel}
      </div>
      {isDropdownVisible && (
        <ul className="dropdownList">
          {items.map(item => (
            <li key={item.id} className="dropdownItem">
              <span onClick={() => handleSelectItem(item.id)}>{item.label}</span>
              <button onClick={(e) => handleDeleteItem(item.id, e)} className="deleteButton">X</button>
            </li>
          ))}
          <li key="addNew" className="dropdownItem addNewItem" onClick={handleShowAddNew}>Add New...</li> 
        </ul>
      )}
      {showAddNew && (
        <div>
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Enter new item"
          />
          <button onClick={handleAddNewItem}>Submit</button>
        </div>
      )}
    </div>
  );
}

export default DropdownWithAdd;