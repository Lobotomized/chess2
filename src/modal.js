// Custom Alert Modal Replacement

window.showAlert = function(message) {
    if (document.getElementById('customAlertModal')) {
        document.getElementById('customAlertModal').remove();
    }

    const modalHtml = `
    <div id="customAlertModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 100000;">
        <div style="background: #f0d9b5; padding: 30px; border-radius: 8px; border: 4px solid #2e2e2e; min-width: 300px; max-width: 80%; text-align: center; font-family: 'Georgia', serif; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
            <h2 style="margin-top: 0; color: #2e2e2e; border-bottom: 2px solid #b58863; padding-bottom: 10px; margin-bottom: 20px;">Alert</h2>
            <p style="color: #2e2e2e; font-size: 16px; margin-bottom: 25px; white-space: pre-wrap; line-height: 1.5; word-break: break-word;">${message}</p>
            <button onclick="document.getElementById('customAlertModal').remove()" style="width: 100%; padding: 12px; background: #2e2e2e; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-family: 'Georgia', serif; font-size: 16px; transition: background 0.2s; -webkit-text-stroke: 0; text-shadow: none;">OK</button>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Add hover effect to button
    const btn = document.querySelector('#customAlertModal button');
    if (btn) {
        btn.onmouseover = () => btn.style.background = '#829769';
        btn.onmouseout = () => btn.style.background = '#2e2e2e';
    }
};

// Custom Confirm Modal Replacement
window.showConfirm = function(message) {
    return new Promise((resolve) => {
        if (document.getElementById('customConfirmModal')) {
            document.getElementById('customConfirmModal').remove();
        }

        const modalHtml = `
        <div id="customConfirmModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 100000;">
            <div style="background: #f0d9b5; padding: 30px; border-radius: 8px; border: 4px solid #2e2e2e; min-width: 300px; max-width: 80%; text-align: center; font-family: 'Georgia', serif; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
                <h2 style="margin-top: 0; color: #2e2e2e; border-bottom: 2px solid #b58863; padding-bottom: 10px; margin-bottom: 20px;">Confirm</h2>
                <p style="color: #2e2e2e; font-size: 16px; margin-bottom: 25px; white-space: pre-wrap; line-height: 1.5; word-break: break-word;">${message}</p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="customConfirmCancelBtn" style="flex: 1; padding: 12px; background: #e53e3e; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-family: 'Georgia', serif; font-size: 16px; transition: background 0.2s; -webkit-text-stroke: 0; text-shadow: none;">Cancel</button>
                    <button id="customConfirmOkBtn" style="flex: 1; padding: 12px; background: #829769; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-family: 'Georgia', serif; font-size: 16px; transition: background 0.2s; -webkit-text-stroke: 0; text-shadow: none;">OK</button>
                </div>
            </div>
        </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        const modal = document.getElementById('customConfirmModal');
        const btnCancel = document.getElementById('customConfirmCancelBtn');
        const btnOk = document.getElementById('customConfirmOkBtn');

        btnCancel.onclick = () => {
            modal.remove();
            resolve(false);
        };

        btnOk.onclick = () => {
            modal.remove();
            resolve(true);
        };
        
        // Add hover effects
        btnCancel.onmouseover = () => btnCancel.style.background = '#c53030';
        btnCancel.onmouseout = () => btnCancel.style.background = '#e53e3e';
        
        btnOk.onmouseover = () => btnOk.style.background = '#6b7f56';
        btnOk.onmouseout = () => btnOk.style.background = '#829769';
    });
};

// Custom Prompt Modal Replacement
window.showPrompt = function(message, defaultValue = '') {
    return new Promise((resolve) => {
        if (document.getElementById('customPromptModal')) {
            document.getElementById('customPromptModal').remove();
        }

        const modalHtml = `
        <div id="customPromptModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 100000;">
            <div style="background: #f0d9b5; padding: 30px; border-radius: 8px; border: 4px solid #2e2e2e; min-width: 300px; max-width: 80%; text-align: center; font-family: 'Georgia', serif; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
                <h2 style="margin-top: 0; color: #2e2e2e; border-bottom: 2px solid #b58863; padding-bottom: 10px; margin-bottom: 20px;">Prompt</h2>
                <p style="color: #2e2e2e; font-size: 16px; margin-bottom: 15px; white-space: pre-wrap; line-height: 1.5; word-break: break-word;">${message}</p>
                <input type="text" id="customPromptInput" value="${defaultValue}" style="width: 100%; padding: 10px; margin-bottom: 25px; border: 2px solid #2e2e2e; border-radius: 4px; box-sizing: border-box; font-family: 'Georgia', serif; font-size: 16px;">
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="customPromptCancelBtn" style="flex: 1; padding: 12px; background: #e53e3e; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-family: 'Georgia', serif; font-size: 16px; transition: background 0.2s; -webkit-text-stroke: 0; text-shadow: none;">Cancel</button>
                    <button id="customPromptOkBtn" style="flex: 1; padding: 12px; background: #829769; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-family: 'Georgia', serif; font-size: 16px; transition: background 0.2s; -webkit-text-stroke: 0; text-shadow: none;">OK</button>
                </div>
            </div>
        </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        const modal = document.getElementById('customPromptModal');
        const input = document.getElementById('customPromptInput');
        const btnCancel = document.getElementById('customPromptCancelBtn');
        const btnOk = document.getElementById('customPromptOkBtn');

        // Focus input automatically
        setTimeout(() => input.focus(), 10);

        btnCancel.onclick = () => {
            modal.remove();
            resolve(null);
        };

        btnOk.onclick = () => {
            modal.remove();
            resolve(input.value);
        };

        input.onkeydown = (e) => {
            if (e.key === 'Enter') btnOk.click();
            if (e.key === 'Escape') btnCancel.click();
        };
        
        // Add hover effects
        btnCancel.onmouseover = () => btnCancel.style.background = '#c53030';
        btnCancel.onmouseout = () => btnCancel.style.background = '#e53e3e';
        
        btnOk.onmouseover = () => btnOk.style.background = '#6b7f56';
        btnOk.onmouseout = () => btnOk.style.background = '#829769';
    });
};

// Also override default alert just in case
window.alert = window.showAlert;
