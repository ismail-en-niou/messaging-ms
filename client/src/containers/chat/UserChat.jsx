import React, { useEffect, useState } from 'react'
import userfetch from "../../hooks/userftech"
import { Stack, Typography, Avatar, Badge } from '@mui/material';

export default function UserChat({ Chat, user }) {
  const {recipientUser } = userfetch(Chat, user);
  const [userschat , setUserChat ] = useState(null);
  useEffect(()=>{
    setUserChat(recipientUser);
  },[recipientUser])
  return (
    <Stack direction="row" gap={3} role="button" className='user-card align-items-center h-full justify-content-between' sx={{ width: '220%', padding: '10px',}}>
      <div className='flex align-items-center'>
        <div className="me-2">
        <Avatar sx={{ width: 46, height: 46, marginRight: '10px' }}>{recipientUser?.username?.charAt(0)}</Avatar>
        </div>
        <div className="text-content">
          <Typography sx={{ fontWeight: 'bold' }}>
            {user?.username}
          </Typography>
          <Typography>
            Text message
          </Typography>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <Typography>
          12/12/2022
        </Typography>
        <Badge badgeContent={4} color="primary" sx={{ marginTop: '10px' , marginLeft:'100%'}} />
        <span className="user-online"></span>
      </div>
    </Stack>
  );
}
