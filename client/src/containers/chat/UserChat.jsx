import React from 'react'
import userFetch  from '../../hooks/userftech'

export default function UserChat(Chat , user) {
  const {recipientUser } = userFetch(Chat.chat , user);
  console.log("doda :  " + recipientUser)
  return (
    <div >userChat</div>
  )
}
