import React from 'react';

function CustomerLogin() {
    return (
        <div className="App">
            <header>
                <h1>Welcome to Ventures Farm</h1>
            </header>
            <main>
                <p>Your online platform for selling milk and curd within a 10 km radius.</p>
            </main>
            <footer>
                <p>&copy; {new Date().getFullYear()} Ventures Farm. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default CustomerLogin;

