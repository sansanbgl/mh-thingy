// ==UserScript==
// @name         MH - SBPack Opener
// @description  Open your SUPER|brie+ Supply Packs in a click!
// @author       Umar Hasan
// @version      1.0.0
// @match        https://www.mousehuntgame.com/*
// @match        https://apps.facebook.com/mousehunt/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// ==/UserScript==

const SB_PACK_TYPE = "sb_supply_pack";

$(document).ready(function() {
    addSbPackTouchPoint();
});

function showSbPackToast(message, type = "info") {
    const containerId = "sbpack-toast-container";
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement("div");
        container.id = containerId;
        container.style.position = "fixed";
        container.style.right = "20px";
        container.style.bottom = "20px";
        container.style.zIndex = "999999";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "8px";
        container.style.pointerEvents = "none";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.maxWidth = "320px";
    toast.style.padding = "10px 14px";
    toast.style.borderRadius = "10px";
    toast.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.2)";
    toast.style.fontSize = "13px";
    toast.style.lineHeight = "1.4";
    toast.style.whiteSpace = "pre-line";
    toast.style.color = "#fff";
    toast.style.backgroundColor = type === "error" ? "#c0392b" : type === "success" ? "#2e7d32" : "#2c3e50";
    toast.style.border = "1px solid rgba(255, 255, 255, 0.14)";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    toast.style.transition = "opacity 160ms ease, transform 160ms ease";

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    });

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(8px)";
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            if (container.children.length === 0 && container.parentNode) {
                container.parentNode.removeChild(container);
            }
        }, 180);
    }, 3200);
}

function addSbPackTouchPoint() {
    if ($('.sbpack_opener').length == 0) {
        const invPages = $('.friends .tournament_scoreboards ');
        const li = document.createElement('li');
        li.classList.add('sbpack_opener');
        const btn = document.createElement('a');
        btn.innerText = "SBPack Opener";
        btn.onclick = function () {
            renderSbPack();
        };

        const icon = document.createElement("div");
        icon.className = "icon";
        btn.appendChild(icon);
        li.appendChild(btn);
        $(li).insertAfter(invPages);
    }
}

function getSbPack() {
    return new Promise((resolve, reject) => {
        postSbPackReq("https://www.mousehuntgame.com/managers/ajax/users/userInventory.php",
                `sn=Hitgrab&hg_is_ajax=1&item_types%5B%5D=${SB_PACK_TYPE}&action=get_items&uh=${user.unique_hash}`
               ).then(res => {
            try {
                var data = JSON.parse(res.responseText);
                var pack = (data.items || []).find(item => item.type == SB_PACK_TYPE);
                resolve(pack || null);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        }, reject);
    });
}

function openSbPack(quantity) {
    return new Promise((resolve, reject) => {
        postSbPackReq("https://www.mousehuntgame.com/managers/ajax/users/useconvertible.php",
                `sn=Hitgrab&hg_is_ajax=1&item_type=${SB_PACK_TYPE}&item_qty=${quantity}&uh=${user.unique_hash}`
               ).then(res => {
            try {
                resolve(JSON.parse(res.responseText));
            } catch (error) {
                console.log(error);
                reject(error);
            }
        }, reject);
    });
}

async function renderSbPack() {
    document
     .querySelectorAll("#sbpack-box")
     .forEach(el => el.remove())

    const div = document.createElement("div");
    div.id = "sbpack-box";
    div.style.backgroundColor = "#F5F5F5";
    div.style.position = "fixed";
    div.style.zIndex = "9999";
    div.style.left = "35vw";
    div.style.top = "20vh";
    div.style.border = "solid 3px #696969";
    div.style.borderRadius = "20px";
    div.style.padding = "10px";
    div.style.textAlign = "center";
    div.style.fontSize = "12px";
    div.style.minWidth = "220px";

    const header = document.createElement("div");
    header.textContent = "SBPack Opener";
    header.style.height = "21px";
    header.style.textAlign = "left";
    header.style.fontWeight = "bold";
    header.style.cursor = "context-menu";
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";

    const closeButton = document.createElement("button");
    closeButton.textContent = "x";
    closeButton.style.marginLeft = "5px";
    closeButton.style.cursor = "pointer";
    closeButton.onclick = function () {
        div.remove();
    };
    header.appendChild(closeButton);

    const content = document.createElement("div");
    content.id = "sbpack-content";
    content.style.paddingTop = "8px";

    const packRow = document.createElement("div");
    packRow.style.display = "flex";
    packRow.style.alignItems = "center";
    packRow.style.gap = "8px";
    packRow.style.textAlign = "left";

    const thumb = document.createElement("img");
    thumb.style.width = "40px";
    thumb.style.height = "40px";
    thumb.style.display = "none";

    const packInfo = document.createElement("div");
    packInfo.textContent = "Loading...";

    packRow.appendChild(thumb);
    packRow.appendChild(packInfo);

    const actionDiv = document.createElement("div");
    actionDiv.style.marginTop = "8px";
    actionDiv.style.display = "none";

    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.min = "1";
    qtyInput.value = "1";
    qtyInput.style.width = "60px";

    const maxBtn = document.createElement("button");
    maxBtn.textContent = "Max";
    maxBtn.style.marginLeft = "5px";
    maxBtn.style.cursor = "pointer";

    const openBtn = document.createElement("button");
    openBtn.textContent = "Open";
    openBtn.style.marginLeft = "5px";
    openBtn.style.cursor = "pointer";

    const refreshBtn = document.createElement("button");
    refreshBtn.textContent = "Refresh";
    refreshBtn.style.marginLeft = "5px";
    refreshBtn.style.cursor = "pointer";

    actionDiv.appendChild(qtyInput);
    actionDiv.appendChild(maxBtn);
    actionDiv.appendChild(openBtn);

    const lootDiv = document.createElement("div");
    lootDiv.id = "sbpack-loot";
    lootDiv.style.marginTop = "8px";
    lootDiv.style.textAlign = "left";

    var ownedQty = 0;

    function setPack(pack) {
        if (pack && pack.quantity > 0) {
            ownedQty = Number(pack.quantity);
            thumb.src = pack.thumbnail;
            thumb.style.display = "";
            packInfo.innerText = pack.name.concat("\nOwned: ", ownedQty);
            qtyInput.max = String(ownedQty);
            if (Number(qtyInput.value) > ownedQty) {
                qtyInput.value = String(ownedQty);
            }
            actionDiv.style.display = pack.can_open === false ? "none" : "";
        } else {
            ownedQty = 0;
            thumb.style.display = pack ? "" : "none";
            packInfo.innerText = "No SUPER|brie+ Supply Packs to open.";
            actionDiv.style.display = "none";
        }
    }

    async function loadPack() {
        packInfo.textContent = "Loading...";
        try {
            setPack(await getSbPack());
        } catch (error) {
            packInfo.textContent = "Failed to load inventory.";
            showSbPackToast("Failed to load SB Packs!", "error");
        }
    }

    maxBtn.onclick = function () {
        qtyInput.value = String(ownedQty);
    };

    refreshBtn.onclick = function () {
        lootDiv.innerHTML = "";
        loadPack();
    };

    openBtn.onclick = async function () {
        var qty = Math.floor(Number(qtyInput.value));
        if (!(qty > 0) || qty > ownedQty) {
            showSbPackToast("Enter an amount between 1 and ".concat(ownedQty, "."), "error");
            return;
        }
        openBtn.disabled = true;
        maxBtn.disabled = true;
        try {
            var data = await openSbPack(qty);
            if (data.success == "1" && data.convertible_open) {
                var loot = data.convertible_open.items || [];
                lootDiv.innerText = "Opened ".concat(data.convertible_open.quantity, " pack(s):\n",
                    loot.map(item => "+" + item.quantity_formatted + " " + item.name).join("\n"));
                var newPack = data.inventory && data.inventory[SB_PACK_TYPE];
                if (newPack) {
                    setPack(newPack);
                } else {
                    await loadPack();
                }
                showSbPackToast("Opened ".concat(data.convertible_open.quantity, " SB Pack(s)!"), "success");
            } else {
                showSbPackToast("Failed to open SB Pack!", "error");
            }
        } catch (error) {
            showSbPackToast("Ajax Request Failed!", "error");
        }
        openBtn.disabled = false;
        maxBtn.disabled = false;
    };

    const footer = document.createElement("div");
    footer.style.marginTop = "8px";
    footer.appendChild(refreshBtn);

    content.appendChild(packRow);
    content.appendChild(actionDiv);
    content.appendChild(lootDiv);
    content.appendChild(footer);
    div.appendChild(header);
    div.appendChild(content);
    document.body.appendChild(div);
    dragSbPackElement(div);

    loadPack();
}

function dragSbPackElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.firstElementChild.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        if (e.target.tagName == "BUTTON") {
            return;
        }
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function postSbPackReq(url, form) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    resolve(this);
                } else {
                    reject(this);
                }
            }
        };
        xhr.onerror = function () {
            reject(this);
        };
        xhr.send(form);
    });
}
