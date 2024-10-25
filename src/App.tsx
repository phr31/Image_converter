import React, { useState } from 'react';

function App() {
  const [inputFiles, setInputFiles] = useState([]);
  const [outputFormat, setOutputFormat] = useState('jpeg'); // formato de saída padrão
  const [convertedURLs, setConvertedURLs] = useState([]);

  // Função para lidar com a seleção de arquivos
  const handleFileChange = (e) => {
    setInputFiles(Array.from(e.target.files)); // Lida com múltiplos arquivos
    setConvertedURLs([]); // Limpa URLs convertidas ao alterar os arquivos
  };

  // Função de conversão de formato
  const convertImages = () => {
    const newConvertedURLs = [];

    inputFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          // Converte a imagem para o formato escolhido e adiciona a URL para download
          const convertedURL = canvas.toDataURL(`image/${outputFormat}`);
          newConvertedURLs.push({ url: convertedURL, name: file.name });

          // Atualiza o estado depois que todos os arquivos foram processados
          if (newConvertedURLs.length === inputFiles.length) {
            setConvertedURLs(newConvertedURLs);
          }
        };
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div>
      <h2>Conversor de Imagens</h2>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />

      <div>
        <label>Formato de saída:</label>
        <select
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value)}
        >
          <option value="jpeg">JPEG</option>
          <option value="png">PNG</option>
          <option value="webp">WEBP</option>
        </select>
      </div>

      <button onClick={convertImages}>Converter Imagens</button>

      <div>
        {convertedURLs.map((file, index) => (
          <div key={index}>
            <a
              href={file.url}
              download={`converted_${file.name}.${outputFormat}`}
            >
              Baixar {file.name} em {outputFormat.toUpperCase()}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
