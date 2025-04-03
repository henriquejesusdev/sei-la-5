document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("userForm");
  const cepInput = document.getElementById("cep");

  // Restaurar dados salvos ao carregar a página
  restoreFormData();

  // Máscara simples para o CEP (XXXXX-XXX)
  cepInput.addEventListener("blur", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    }
    e.target.value = value;

    // Buscar endereço quando CEP estiver completo
    if (value.length === 9) {
      console.log(value);
      fetchAddress(value);
    }
  });

  // Salvar dados no submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    saveFormData();
    alert("Dados salvos com sucesso!");
  });
});

// Função para buscar endereço na API ViaCEP
function fetchAddress(cep) {
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then((response) => response.json())
    .then((data) => {
      if (!data.erro) {
        document.getElementById("logradouro").value = data.logradouro || "";
        document.getElementById("bairro").value = data.bairro || "";
        document.getElementById("cidade").value = data.localidade || "";
        document.getElementById("uf").value = data.uf || "";
        saveFormData(); // Salva automaticamente após preencher
      } else {
        alert("CEP não encontrado!");
        clearAddressFields();
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar CEP:", error);
      alert("Erro ao buscar o CEP. Tente novamente.");
      clearAddressFields();
    });
}

// Função para salvar dados no Web Storage
function saveFormData() {
  const formData = {
    nome: document.getElementById("nome").value,
    cep: document.getElementById("cep").value,
    logradouro: document.getElementById("logradouro").value,
    bairro: document.getElementById("bairro").value,
    cidade: document.getElementById("cidade").value,
    uf: document.getElementById("uf").value,
  };
  localStorage.setItem("userFormData", JSON.stringify(formData));
}

// Função para restaurar dados do Web Storage
function restoreFormData() {
  const savedData = localStorage.getItem("userFormData");
  if (savedData) {
    const formData = JSON.parse(savedData);
    document.getElementById("nome").value = formData.nome || "";
    document.getElementById("cep").value = formData.cep || "";
    document.getElementById("logradouro").value = formData.logradouro || "";
    document.getElementById("bairro").value = formData.bairro || "";
    document.getElementById("cidade").value = formData.cidade || "";
    document.getElementById("uf").value = formData.uf || "";
  }
}

// Função para limpar campos de endereço
function clearAddressFields() {
  document.getElementById("logradouro").value = "";
  document.getElementById("bairro").value = "";
  document.getElementById("cidade").value = "";
  document.getElementById("uf").value = "";
}
