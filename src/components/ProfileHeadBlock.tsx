"use client"
import React from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Result, Typography } from 'antd';
import { redirect } from 'next/navigation';

const { Paragraph, Text } = Typography;

const ProfileHeadBlock: React.FC = () => (
  
  <Result
    status="error"
    title="Failed to show the user profile"
    subTitle="You have been blocked by the user"
    extra={[
      <Button type="primary" key="console" onClick={() => redirect('/')}>
        Go Console
      </Button>,
    ]}
    className='bg-white'
  >
    <div className="desc">
      <Paragraph>
        <Text
          strong
          style={{
            fontSize: 16,
          }}
        >
          The content you submitted has the following error:
        </Text>
      </Paragraph>
      <Paragraph>
        <CloseCircleOutlined className="site-result-demo-error-icon" /> Your account has been
        frozen. <a>Thaw immediately &gt;</a>
      </Paragraph>
      <Paragraph>
        <CloseCircleOutlined className="site-result-demo-error-icon" /> Your account is not yet
        eligible to apply. <a>Apply Unlock &gt;</a>
      </Paragraph>
    </div>
  </Result>
);

export default ProfileHeadBlock;