import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "./App.css";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import "./custom.css";
import { eachDayOfInterval } from "date-fns";

function App() {
  const [message, setMessage] = useState("");
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [bookingDetails, setBookingDetails] = useState([]);
  const selectRef = useRef(null);

  async function getData() {
    const response = await fetch("http://localhost:8000");
    const data = await response.json();
    if (data) setMessage(data.message);
  }

  async function getUsers() {
    const response = await fetch("http://localhost:8000/users");
    const data = await response.json();
    if (data) setUsers(data.users);
  }

  async function getBookingDetails() {
    const response = await fetch("http://localhost:8000/booking-details");
    const data = await response.json();
    if (data) setBookingDetails(data.bookingDetails);
  }

  useEffect(() => {
    getData();
    getUsers();
    getBookingDetails();
  }, []);

  const handleSubmit = async () => {
    if (
      dateRange[0].startDate.toDateString() ===
      dateRange[0].endDate.toDateString()
    ) {
      alert("Please select checkout date");
      return;
    }
    const data = {
      userId,
      startDate: dateRange[0].startDate,
      endDate: dateRange[0].endDate,
    };
    try {
      const response = await fetch("http://localhost:8000/book-room", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 201) {
        const data = await response.json();
        alert("Booking successfull");
        if (
          new Date(data.bookingDetails.startDate).toDateString() ===
          new Date(data.bookingDetails.endDate).toDateString()
        ) {
          console.log("true statement");
          setDateRange([
            {
              startDate: new Date(data.bookingDetails.startDate),
              endDate: new Date(data.bookingDetails.startDate),
              key: "selection",
              showDateDisplay: false,
            },
          ]);
        } else {
          console.log("false statement");
          setDateRange([
            {
              startDate: new Date(data.bookingDetails.startDate),
              endDate: new Date(data.bookingDetails.endDate),
              key: "selection",
            },
          ]);
        }
        setUserId(null);
        selectRef.current.options.selectedIndex = 0;
        getBookingDetails();
      }
    } catch (error) {
      console.log(error);
      alert(error.toString());
    }
  };

  const disabledDates = useMemo(() => {
    let datesArr = [];
    bookingDetails.forEach((detail) => {
      const arr = eachDayOfInterval({
        start: detail.startDate,
        end: detail.endDate,
      });
      arr.forEach((date) => datesArr.push(date));
    });
    return datesArr;
  }, [bookingDetails, handleSubmit]);

  const enableBooking = useCallback(() => {
    if (!dateRange || !userId) {
      return true;
    }
    if (dateRange && disabledDates) {
      return disabledDates.some(
        (date) =>
          date.toDateString() === dateRange[0].startDate.toDateString() ||
          date.toDateString() === dateRange[0].endDate.toDateString()
      );
    }
    return false;
  }, [bookingDetails, dateRange, userId, handleSubmit]);

  return (
    <div className="flex items-center justify-center flex-col min-h-screen gap-4">
      <h1 className="text-5xl font-semibold text-slate-800">
        {message ? message : "Loading..."}
      </h1>
      <div>
        {users && users.length ? (
          <select ref={selectRef} onChange={(e) => setUserId(e.target.value)}>
            <option value="">Select User</option>
            {users.map((user, index) => (
              <option key={index} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {bookingDetails ? (
        <DateRangePicker
          minDate={new Date()}
          disabledDates={disabledDates}
          staticRanges={[]}
          inputRanges={[]}
          showMonthAndYearPickers={false}
          showDateDisplay={false}
          onChange={(item) => setDateRange([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={dateRange}
        />
      ) : (
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={enableBooking()}
        className="border px-4 py-2 rounded-lg bg-blue-500 text-white disabled:bg-slate-200 disabled:cursor-not-allowed disabled:text-slate-400"
      >
        Book Room
      </button>
    </div>
  );
}

export default App;
