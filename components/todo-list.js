import React, { useState, useRef } from 'react';

const TodoList = () => {
  const [items, setItems] = useState([]);
  const [inputText, setInputText] = useState('');
  
  // States specifically for handling in-row editing
  const [editId, setEditId] = useState(null); 
  const [editInputText, setEditInputText] = useState(''); // Handles text for the active row being edited
  
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const inputRef = useRef(null);

  // Handles adding a new item (Top main input only)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newItem = {
      id: Date.now(), 
      text: inputText
    };
    setItems([...items, newItem]);
    
    setInputText('');
    setConfirmDeleteId(null);
    inputRef.current.focus();
  };

  // Triggers when the 'Edit' button inside a specific row is clicked
  const handleEditClick = (id, text) => {
    setEditId(id);
    setEditInputText(text); // Pre-fill the row input with the existing text
    setConfirmDeleteId(null);
  };

  // Saves the changes directly within the row
  const handleUpdate = (id) => {
    if (!editInputText.trim()) {
      alert('Task cannot be empty!');
      return;
    }

    const updatedItems = items.map(item => 
      item.id === id ? { ...item, text: editInputText } : item
    );
    setItems(updatedItems);
    setEditId(null); // Exit editing mode
    setEditInputText('');
  };

  // Handles item deletion
  const handleDeleteClick = (id) => {
    if (confirmDeleteId === id) {
      const remainingItems = items.filter(item => item.id !== id);
      setItems(remainingItems);
      setConfirmDeleteId(null);
      if (editId === id) {
        setEditId(null);
        setEditInputText('');
      }
    } else {
      setConfirmDeleteId(id);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' }}>
      <h2>List of Items</h2>
      
      {/* Main Form: Dedicated solely to adding new tasks now */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          ref={inputRef} 
          type="text" 
          value={inputText} 
          onChange={(e) => setInputText(e.target.value)} 
          placeholder="Enter item details..." 
          required 
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
        />
        <button 
          type="submit" 
          style={{ padding: '10px 20px', background: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Add
        </button>
      </form>

      <h3>Orderlist</h3>
      {items.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No items added yet.</p>
      ) : (
        <ol style={{ paddingLeft: '20px' }}>
          {items.map((item) => (
            <li key={item.id} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', background: '#f9f9f9', padding: '8px 12px', borderRadius: '4px', border: '1px solid #eee' }}>
                
                {/* Conditional Rendering: Show input field if editing this row, otherwise show plain text */}
                {editId === item.id ? (
                  <input 
                    type="text"
                    value={editInputText}
                    onChange={(e) => setEditInputText(e.target.value)}
                    style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid #007BFF', marginRight: '10px' }}
                    autoFocus
                  />
                ) : (
                  <span style={{ wordBreak: 'break-word', flex: 1 }}>
                    {item.text} <small style={{ color: '#aaa', marginLeft: '10px' }}>(Ref ID: {item.id})</small>
                  </span>
                )}
                
                {/* Action Buttons Group */}
                <div style={{ display: 'flex', gap: '5px' }}>
                  {editId === item.id ? (
                    <>
                      {/* Inline Update Button */}
                      <button 
                        onClick={() => handleUpdate(item.id)} 
                        style={{ padding: '4px 8px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                      >
                        Update
                      </button>
                      {/* Cancel Button */}
                      <button 
                        onClick={() => setEditId(null)} 
                        style={{ padding: '4px 8px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    /* Default Edit Button */
                    <button 
                      onClick={() => handleEditClick(item.id, item.text)} 
                      style={{ padding: '4px 8px', background: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Edit
                    </button>
                  )}
                  
                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDeleteClick(item.id)} 
                    style={{ 
                      padding: '4px 8px', 
                      background: confirmDeleteId === item.id ? '#7a3802' : '#dc3545', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer', 
                      fontSize: '12px',
                      fontWeight: confirmDeleteId === item.id ? 'bold' : 'normal'
                    }}
                  >
                    {confirmDeleteId === item.id ? 'Confirm?' : 'Delete'}
                  </button>
                </div>

              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default TodoList