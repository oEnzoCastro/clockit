"use client";

import React from "react";
import Event from "../../models/event";
import "./EventModal.css";

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventModal({
  event,
  isOpen,
  onClose,
}: EventModalProps) {
  if (!isOpen || !event) return null;

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const calculateDuration = () => {
    const durationMs = event.endTime.getTime() - event.startTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">{event.subject}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="event-detail-section">
            <div className="detail-item">
              <div className="detail-icon">📅</div>
              <div className="detail-content">
                <span className="detail-label">Date</span>
                <span className="detail-value">
                  {formatDateTime(event.startTime)}
                </span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">⏰</div>
              <div className="detail-content">
                <span className="detail-label">Time</span>
                <span className="detail-value">
                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">⏱️</div>
              <div className="detail-content">
                <span className="detail-label">Duration</span>
                <span className="detail-value">{calculateDuration()}</span>
              </div>
            </div>

            {event.location && (
              <div className="detail-item">
                <div className="detail-icon">📍</div>
                <div className="detail-content">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">{event.location}</span>
                </div>
              </div>
            )}

            {event.recurrence &&
              event.recurrence !== "none" &&
              event.recurrence.trim() !== "" && (
                <div className="detail-item">
                  <div className="detail-icon">🔄</div>
                  <div className="detail-content">
                    <span className="detail-label">Recurrence</span>
                    <span className="detail-value">{event.recurrence}</span>
                  </div>
                </div>
              )}

            <div className="detail-item">
              <div className="detail-icon">🏷️</div>
              <div className="detail-content">
                <span className="detail-label">Event ID</span>
                <span className="detail-value detail-id">{event.id}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          {/* <button className="btn-primary">Edit Event</button> */}
        </div>
      </div>
    </div>
  );
}
