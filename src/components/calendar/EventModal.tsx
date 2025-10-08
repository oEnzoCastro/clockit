"use client";

import React, { useCallback, useMemo, memo } from "react";
import Event from "../../models/event";
import "./EventModal.css";

interface EventModalProps {
  event: Event | Event[] | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventModal = memo(function EventModal({
  event,
  isOpen,
  onClose,
}: EventModalProps) {
  // Hooks must be called before any early returns
  const events = useMemo(
    () => (event && Array.isArray(event) ? event : event ? [event] : []),
    [event]
  );

  const formatDateTime = useCallback((date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }, []);

  const calculateDuration = useCallback((startTime: Date, endTime: Date) => {
    const durationMs = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  }, []);

  const timeRange = useMemo(() => {
    if (events.length === 0) {
      return { start: new Date(), end: new Date() };
    }
    const startTimes = events.map((e) => e.event_start_time.getTime());
    const endTimes = events.map((e) => e.event_end_time.getTime());
    return {
      start: new Date(Math.min(...startTimes)),
      end: new Date(Math.max(...endTimes)),
    };
  }, [events]);

  const uniqueLocations = useMemo(() => {
    return Array.from(
      new Set(events.map((e) => e.event_location).filter(Boolean))
    );
  }, [events]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Early return after all hooks
  if (!isOpen || !event) return null;

  const isMultipleEvents = events.length > 1;
  const firstEvent = events[0];

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">
            {firstEvent.subject_name}
            {isMultipleEvents && (
              <span className="monitor-count"> ({events.length} monitors)</span>
            )}
          </h2>
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
                  {formatDateTime(firstEvent.event_start_time)}
                </span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">⏰</div>
              <div className="detail-content">
                <span className="detail-label">Time Range</span>
                <span className="detail-value">
                  {formatTime(timeRange.start)} - {formatTime(timeRange.end)}
                </span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">⏱️</div>
              <div className="detail-content">
                <span className="detail-label">Total Duration</span>
                <span className="detail-value">
                  {calculateDuration(timeRange.start, timeRange.end)}
                </span>
              </div>
            </div>

            {uniqueLocations.length > 0 && (
              <div className="detail-item">
                <div className="detail-icon">📍</div>
                <div className="detail-content">
                  <span className="detail-label">
                    Location{uniqueLocations.length > 1 ? "s" : ""}
                  </span>
                  <span className="detail-value">
                    {uniqueLocations.join(", ")}
                  </span>
                </div>
              </div>
            )}

            {firstEvent.event_recurrence &&
              firstEvent.event_recurrence !== "none" &&
              firstEvent.event_recurrence.trim() !== "" && (
                <div className="detail-item">
                  <div className="detail-icon">🔄</div>
                  <div className="detail-content">
                    <span className="detail-label">Recurrence</span>
                    <span className="detail-value">
                      {firstEvent.event_recurrence}
                    </span>
                  </div>
                </div>
              )}

            {/* Monitor Details Section */}
            <div className="detail-item">
              <div className="detail-icon">👨</div>
              <div className="detail-content">
                <span className="detail-label">
                  Monitor{isMultipleEvents ? "s" : ""}
                </span>
                <div className="monitor-details">
                  {events.map((evt, index) => (
                    <div key={evt.event_id} className="monitor-item">
                      <div className="monitor-info">
                        <strong>{evt.monitor_name}</strong>
                        <small>
                          {evt.course_name} - {evt.subject_semester}° semester
                        </small>
                        <div className="monitor-time">
                          {formatTime(evt.event_start_time)} -{" "}
                          {formatTime(evt.event_end_time)}
                          <span className="monitor-duration">
                            (
                            {calculateDuration(
                              evt.event_start_time,
                              evt.event_end_time
                            )}
                            )
                          </span>
                        </div>
                        {evt.event_location && (
                          <div className="monitor-location">
                            📍 {evt.event_location}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
});

export default EventModal;
