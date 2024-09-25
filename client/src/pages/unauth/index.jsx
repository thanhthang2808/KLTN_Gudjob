import React from 'react';

function UnauthPage () {
    return (
        <div style={{ textAlign: 'center',  }}>
            <h1>Unauthorized Access</h1>
            <p>You do not have permission to view this page.</p>
            <a href="/login">Go to Login</a>
        </div>
    );
};

export default UnauthPage;