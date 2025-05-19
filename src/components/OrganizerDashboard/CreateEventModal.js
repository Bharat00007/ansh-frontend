import React, { useState } from 'react';
import { auth } from '../../firebase-config'; // Import Firebase Auth
import { FaCloudUploadAlt, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import './CreateEventModal.css';

function CreateEventModal({ onClose, onEventCreated }) {
    const [eventType, setEventType] = useState('free');
    const [eventMode, setEventMode] = useState('online');
    const [bannerImage, setBannerImage] = useState(null);
    const [eventName, setEventName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [location, setLocation] = useState('');
    const [onlineLink, setOnlineLink] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleBannerUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setBannerImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!bannerImage) {
            alert('Please upload an event banner!');
            return;
        }
    
        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in to create an event.");
            return;
        }
    
        try {
            // Upload the event banner
            const eventId = new Date().getTime().toString();
            const uploadResponse = await fetch('http://localhost:5000/upload-banner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ base64: bannerImage.split(',')[1], eventId }),
            });
    
            const uploadData = await uploadResponse.json();
            if (!uploadResponse.ok) throw new Error(uploadData.error);
    
            const bannerUrl = uploadData.bannerUrl;
    
            // Save event details in Firestore
            const newEvent = {
                eventName,
                date,
                time,
                mode: eventMode,
                description,
                eventType,
                price: eventType === 'paid' ? price : 0,
                location: eventMode !== 'online' ? location : '',
                onlineLink: eventMode !== 'offline' ? onlineLink : '',
                bannerUrl,
                organizerId: user.uid,
                createdAt: new Date().toISOString() // Ensure correct sorting
            };
    
            const response = await fetch('http://localhost:5000/create-event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEvent),
            });
    
            const data = await response.json();
            console.log('✅ Event Created:', data);
    
            // ✅ Fetch new events after creating one
            if (typeof onEventCreated === "function") onEventCreated();
    
            // Show success message and close modal
            setSuccessMessage('Event successfully added!');
            setTimeout(() => onClose(), 1500);
    
        } catch (error) {
            console.error('❌ Error creating event:', error);
        }
    };
    

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Create New Event</h2>
                    <button onClick={onClose} className="close-btn"><FaTimes /></button>
                </div>

                <form onSubmit={handleSubmit} className="create-event-form">
                    {successMessage && <div className="success-message">{successMessage}</div>}

                    <div className="form-group">
                        <label>Event Name</label>
                        <input type="text" placeholder="Enter event name" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Date & Time</label>
                        <div className="datetime-inputs">
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Event Description</label>
                        <textarea placeholder="Describe your event details" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Event Mode</label>
                        <div className="event-mode-selector">
                            <button type="button" className={eventMode === 'online' ? 'active' : ''} onClick={() => setEventMode('online')}>Online</button>
                            <button type="button" className={eventMode === 'offline' ? 'active' : ''} onClick={() => setEventMode('offline')}>Offline</button>
                            <button type="button" className={eventMode === 'hybrid' ? 'active' : ''} onClick={() => setEventMode('hybrid')}>Hybrid</button>
                        </div>

                        {(eventMode === 'offline' || eventMode === 'hybrid') && (
                            <div className="location-input">
                                <label>Event Location</label>
                                <div className="location-field">
                                    <FaMapMarkerAlt className="location-icon" />
                                    <input type="text" placeholder="Enter venue address" value={location} onChange={(e) => setLocation(e.target.value)} required />
                                </div>
                            </div>
                        )}

                        {(eventMode === 'online' || eventMode === 'hybrid') && (
                            <div className="online-link-input">
                                <label>Online Meeting Link</label>
                                <input type="url" placeholder="Paste your Zoom, Google Meet, or other link" value={onlineLink} onChange={(e) => setOnlineLink(e.target.value)} required={eventMode !== 'offline'} />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Event Type</label>
                        <div className="event-type-selector">
                            <button type="button" className={eventType === 'free' ? 'active' : ''} onClick={() => setEventType('free')}>Free</button>
                            <button type="button" className={eventType === 'paid' ? 'active' : ''} onClick={() => setEventType('paid')}>Paid</button>
                        </div>

                        {eventType === 'paid' && (
                            <div className="price-input">
                                <label>Ticket Price</label>
                                <input type="number" placeholder="Enter ticket price" value={price} onChange={(e) => setPrice(e.target.value)} min="0" required />
                            </div>
                        )}
                    </div>

                    <div className="form-group banner-upload">
                        <label>Event Poster</label>
                        <div className="upload-area" onClick={() => document.getElementById('banner-upload').click()}>
                            {bannerImage ? <img src={bannerImage} alt="Event Poster" /> : <><FaCloudUploadAlt className="upload-icon" /><p>Click to upload or drag and drop</p></>}
                        </div>
                        <input type="file" id="banner-upload" accept="image/*" hidden onChange={handleBannerUpload} />
                    </div>

                    <button type="submit" className="create-event-submit">Create Event</button>
                </form>
            </div>
        </div>
    );
}

export default CreateEventModal;
