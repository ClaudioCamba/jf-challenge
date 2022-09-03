const outOfStockModal = (() => {
  const style = `
  <style>
  /* Modal */
.show-modal .modal {
  display: flex;
}

.modal {
  box-sizing: border-box;
  display: none;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  justify-content: center;
  align-items: center;
  z-index: 16777216;
  text-align: center;
}
.modal .modal-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 600px;
  height: max-content;
  height: -webkit-max-content;
  height: -moz-max-content;
  padding: 50px;
  background-color: #f8f6f7;
  position: relative;
  background-image: url(https://i.postimg.cc/T1HXZL4J/background.jpg);
  background-repeat: repeat;
  background-size: 100px 100px;
}
.modal .modal-content .close-modal,
.modal .modal-content .close-modal:hover,
.modal .modal-content .close-modal:focus {
  color: #000;
  font-size: 40px;
  padding: 5px 10px;
  background-color: transparent;
  position: absolute;
  right: 0;
  top: 0;
}
.modal .modal-content form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
  padding: 40px;
  background-color: #71787a;
  background-color: rgba(113, 120, 122, 0.8);
}
.modal .modal-content form h3 {
  font-family: "Gotham", "Arial Black", Arial, Arial, sans-serif;
  font-size: 30px;
  font-style: initial;
  font-weight: normal;
  color: #fff;
  margin: 0;
}
.modal .modal-content form label {
  max-width: 300px;
  width: 100%;
}
.modal .modal-content form label input {
  background: #fff;
  border: 1px solid #71787a;
  outline: none;
  color: #000;
  width: 100%;
}

.modal.successful-submit form h3 {
  font-weight: 900;
}
.modal.successful-submit form label,
.modal.successful-submit form button {
  display: none;
}

/* Error styling */
input:focus:invalid {
  outline: none;
}

/* This is the style of our error messages */
.error:empty {
  display: none;
}

.error,
.error.active {
  width: 100%;
  padding: 0;
  font-size: 12px;
  color: #fff;
  background-color: #d02330;
  border: 1px solid #71787a;
  border-radius: 0;
  box-sizing: border-box;
  display: block;
  padding: 0.3em;
}

@media only screen and (max-width: 640px) {
  .modal {
    padding: 40px 20px 0;
  }
  .modal .modal-content {
    padding: 40px 30px 30px;
  }
  .modal .modal-content .close-modal,
.modal .modal-content .close-modal:hover,
.modal .modal-content .close-modal:focus {
    font-size: 30px;
  }
  .modal .modal-content form {
    padding: 30px 20px;
  }
  .modal .modal-content form h3 {
    font-size: 22px;
  }
}
</style>
  `;

  const button = document.createElement("button");
  button.innerText = "Open Modal";
  button.classList.add("modal-btn");

  const modalWrap = document.createElement("div");
  modalWrap.classList.add("modal");
  modalWrap.innerHTML = `<div class="modal-content">
      <button class="close-modal">X</button>
      <form novalidate>
        <h3>Enter your email below to be notified when [Product Name] is back in stock</h3>
        <label for="mail">
          <input type="email" id="mail" name="mail" required placeholder="Enter your email" />
          <span class="error" aria-live="polite"></span>
        </label>
        <button class="submit-btn" type="button">Submit</button>
      </form>
    </div>`;

  function modalControl() {
    const modalBtn = document.querySelectorAll(".modal-btn, .close-modal");
    const bodyElem = document.querySelector("body");
    // Class Toggle
    function modalToggle() {
      if (bodyElem.classList.contains("show-modal") === true) {
        bodyElem.classList.remove("show-modal");
      } else {
        modalWrap.querySelector("h3").innerText = "Enter your email below to be notified when [Product Name] is back in stock";
        modalWrap.classList.remove("successful-submit");
        bodyElem.classList.add("show-modal"); // Modal toggler
      }
    }
    // Adding eventlistener to Buttons
    modalBtn.forEach((btn) => btn.addEventListener("click", () => modalToggle()));
    window.onclick = function (event) {
      if (event.target == modalWrap) {
        modalToggle();
      }
    };
  }

  function emailValidation() {
    const submit = document.querySelector(".submit-btn");
    const email = document.querySelector("#mail");
    const emailError = document.querySelector("#mail + span.error");

    function showEmailError() {
      if (email.validity.valueMissing) {
        emailError.textContent = "You need to enter an e-mail address.";
      } else if (email.validity.typeMismatch) {
        emailError.textContent = "Please enter a valid email format.";
      }
      emailError.className = "error active";
    }

    email.addEventListener("input", function (event) {
      if (email.validity.valid) {
        emailError.textContent = ""; // Reset the content of the message
        emailError.className = "error"; // Reset the visual state of the message
      } else {
        showEmailError();
      }
    });

    submit.addEventListener("click", function (event) {
      // if the email field is valid, we let the form submit
      if (!email.validity.valid) {
        showEmailError();
      } else {
        modalWrap.classList.add("successful-submit");
        modalWrap.querySelector("h3").innerText = "Email Successfully submitted, you will be notified when this product is back in stock";
      }
    });
  }

  return {
    style,
    button,
    modalWrap,
    modalControl,
    emailValidation,
  };
})();

// Wait for element to load
var clearOutOfStock = setInterval(function () {
  if (document.querySelectorAll(".column.main .products-grid").length > 0) {
    clearInterval(clearOutOfStock); //clear interval (Always clear your timers/intervals when the task has been completed)
    const parentElem = document.querySelectorAll(".column.main .products-grid")[0];
    document.head.insertAdjacentHTML("beforeend", outOfStockModal.style);
    parentElem.insertBefore(outOfStockModal.button, parentElem.firstChild);
    document.body.appendChild(outOfStockModal.modalWrap);
    outOfStockModal.modalControl();
    outOfStockModal.emailValidation();
  } else if (document.readyState === "complete") {
    clearInterval(clearOutOfStock);
  }
}, 100);
