import React, { useEffect, useState } from 'react'
import logo from '../../../Assets/Images/Logo.png'
import userimg from '../../../Assets/Images/user.png'
import inbox from '../../../Assets/Images/inbox.png'
import send from '../../../Assets/Images/send.png'
import trash from '../../../Assets/Images/trash.png'
import compose from '../../../Assets/Images/compose.png'
import emailIcon from '../../../Assets/Images/Email Icon.png'
import axios from 'axios'
import moment from 'moment'

function Inbox() {

  //hook for get mail datas from the api
  const [mailData, setMailData] = useState([]);

  //hook for unreadMail
  const [unreadMail, setUnreadMail] = useState(false);

  //hook for unreadMail count and use it in the badges
  const [unreadMailCount, setUnreadMailCount] = useState(0);
  const [mails, setMails] = useState();

  // sidebar Button Cliked
  const [sidebarBtnClicked, setSidebarBtnClicked] = useState(
    <div className="col-6">
      <div className="composeClicked">
        <div className="composeMessage text-center p-3">
          <img src={emailIcon} alt="" />
          <h3 className="fw-bold pb-2">Welcome to <span>iPost Mail</span> Jatin</h3>
          <p className="fw-bold">Thanks for using <span>iPost Mail.</span>
            Please tell us about your experience and give us feedback.
            Your feedback helps us create a better experience
            for you and for all of our customers</p>
        </div>
      </div>
    </div>
  );

  //Function for compose button clicked
  const composeClick = () => {
    setSidebarBtnClicked(
      <div className="col-6">
        <div className="composeClicked">
          <div className="upperSide">
            <p className="text-dark fw-bold p-2">New Message</p>
          </div>
          <div className="sendForm">
            <form>
              <div className="mb-3">
                <input type="email" className="form-control" placeholder="Recipents" name='recipents' />
              </div>
              <div className="mb-3">
                <input type="text" className="form-control" id="exampleInputPassword1"
                  placeholder="Subject" name='subject' />
              </div>
              <div className="mb-3">
                <textarea name="message" cols="30" rows="13"></textarea>
              </div>

              <button type="submit" className="btn btn-primary">Send <img src="images/Sent.png"
                alt="" /></button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  //hook for get api data
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get("http://192.168.0.99:4002/v1/mails/getMails", {
      headers: {
        'authorization': `bearer ${token}`
      }
    }).then((response) => {
      const mailData = response.data.data.mailData;
      const unreadMailCount = response.data.data.unreadMailCount;

      setMailData(mailData);
      if (unreadMailCount != 0) {
        setUnreadMail(true);
        setUnreadMailCount(unreadMailCount);
      } else {
        setUnreadMail(false)
      }

    }).catch((error) => {
      console.log(error);
    })
  }, [])

  // useEffect(() => {

  // }, [cardClick])
  //function for card clicked and showing data
  const cardClick = (e) => {
    const mailId = e.currentTarget.id
    mailData.map(({ _id, from, createdAt, subject, message, status }) => {
      if (_id == mailId) {
        setSidebarBtnClicked(
          <div className="col-6">
            <div className="composeClicked">
              <div className="composeCard">
                <div className="composeCardContent">
                  <div className="composeCardImg">
                    <img src="images/userImage" alt="" />
                  </div>
                  <div className="composeCardData ">
                    <h6>{from.email}</h6>
                    <p>{moment(createdAt).format('h:mm a,MMM Do YYYY')}</p>
                  </div>
                </div>
                <div className="composeCardMessage pt-5">
                  <span className="fw-bold">{subject}</span>
                  <p className="mt-4">{message}</p>
                </div>
              </div>
              <div className="createFooter fw-bold">
                <span>@iPost Mail</span> by Jatin & Stavan
              </div>
            </div>
          </div>);
      }
    })
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className=" container-fluid">
          <a className="navbar-brand" href="#"><img src={logo} alt="" /></a>
          <ul className="nav justify-content-end">
            <li className="nav-item">
              <img src={userimg} alt="" />
            </li>
          </ul>
        </div>
      </nav>
      <section className="container-fluid">
        <div className="row demo">
          <div className="col-2">
            <div className="sideBar">
              <ul className="pt-3">
                <li className="mb-3"><img src={inbox} alt="" className="me-2" /><a href="">Inbox
                  {unreadMail ? <span className="badge ms-5">{unreadMailCount}</span> : unreadMail} </a></li>
                <li className="mb-3"><img src={send} alt="" className="me-2" /><a href="">Send</a></li>
                <li className="mb-3"><img src={trash} alt="" className="me-2" /><a href="">Trash</a></li>
                <li className="composeBtn" onClick={composeClick}><img src={compose} alt="" className="me-2" /><a onClick={composeClick}>Compose</a></li>
              </ul>
            </div>
          </div>
          <div className="col-4 ">
            <div className="messages">
              {mailData.length != 0 ? mailData.map(({ _id, from, subject, createdAt, status }, index) => (
                status == "UNREAD" ?
                  <div className="cardClicked" key={index} onClick={cardClick} id={_id}>
                    <div className="card pb-3">
                      <div className="cardContent">
                        <div className="cardImg">
                          <p style={{ fontSize: '20px', margin: "10px", position: "absolute" }}>{from.firstName.charAt(0).toUpperCase() + " " + from.lastName.charAt(0).toUpperCase()}</p>
                        </div>
                        <div className="cardData ">
                          <h6>{from.firstName + " " + from.lastName}</h6>
                          <div className="para">
                            <p>Physics Tutor</p>
                            {/* <p>10:11 PM, Jul 15, 2021</p> */}
                            <p>{moment(createdAt).format('h:mm a,MMM Do YYYY')}</p>
                          </div>
                        </div>
                      </div>
                      <div className="cardMessage">
                        <span>{subject}</span>
                      </div>
                    </div>
                  </div>
                  : <div className="cardClicked" key={index} onClick={cardClick} id={_id}>
                    <div className="card pb-3">
                      <div className="cardContent">
                        <div className="cardImg">
                          <p>{from.firstName.charAt(0).toUpperCase() + " " + from.lastName.charAt(0).toUpperCase()}</p>
                        </div>
                        <div className="cardData read">
                          <h6>{from.firstName + " " + from.lastName}</h6>
                          <div className="para">
                            <p>Physics Tutor</p>
                            {/* <p>10:11 PM, Jul 15, 2021</p> */}
                            <p>{moment(createdAt).format('h:mm a,MMM Do YYYY')}</p>
                          </div>
                        </div>
                      </div>
                      <div className="cardMessage">
                        <span>{subject}</span>
                      </div>
                    </div>
                  </div>

              )) : "Data Not Found"}

              {/* Card End */}
            </div>
          </div>
          {sidebarBtnClicked}
        </div>
      </section >
    </>
  )
}

export default Inbox