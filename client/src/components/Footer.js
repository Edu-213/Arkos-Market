import React from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';

const FooterSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:space-y-2 md:pt-[50px] p-[10px]">
      <button className="flex justify-between items-center w-full md:cursor-default md:pointer-events-none" onClick={() => setOpen(!open)}>
        <h4 className="font-semibold text-white pt-[10px] md:pt-0">{title}</h4>
        <span className="md:hidden">{open ? '-' : '+'}</span>
      </button>
      <div className={`${open ? 'block' : 'hidden'} md:block text-sm text-gray-300`}>{children}</div>
    </div>
  );
};

function Footer() {
  const location = useLocation();
  const isSimpleFooterPage = ['/login', '/cadastro', '/carrinho'].includes(location.pathname);

  if (isSimpleFooterPage) {
    return (
      <footer className="bg-[#374151] ">
        <div className="text-center text-base text-white border-t border-gray-600 py-[16px]">© Todos os direitos reservados</div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#374151] mt-[50px]">
      <div className="container mx-auto grid md:grid-cols-5 text-sm">
        <FooterSection title="Institucional">
          <ul>
            <li>Quem somos</li>
            <li>Localização</li>
            <li>Nossas lojas</li>
            <li>Blog</li>
          </ul>
        </FooterSection>
        <FooterSection title="Dúvidas">
          <ul>
            <li>Como comprar</li>
            <li>Entrega</li>
            <li>Compras</li>
            <li>Formas de Pagamento</li>
          </ul>
        </FooterSection>
        <FooterSection title="Ajuda">
          <ul>
            <li>Sac</li>
            <li>Fale conosco</li>
            <li>Termos de uso</li>
            <li>Política de Privacidade</li>
          </ul>
        </FooterSection>
        <FooterSection title="Pagamento">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <img src="imagens/pagamento-visa.svg" alt="Visa" className="h-6"></img>
              <img src="imagens/pagamento-master-card.svg" alt="Visa" className="h-6"></img>
            </div>
            <div className="flex gap-2">
              <img src="imagens/pagamento-american-express.svg" alt="Visa" className="h-6"></img>
              <img src="imagens/pagamento-boleto.svg" alt="Visa" className="h-6"></img>
            </div>
            <div className="flex gap-2">
              <img src="imagens/pagamento-pix.svg" alt="Visa" className="h-6"></img>
              <img src="imagens/pagamento-nupay.svg" alt="Visa" className="h-6"></img>
            </div>
          </div>
        </FooterSection>
        <FooterSection title="Newsletter">
          <div className="relative ">
            <input type="email" placeholder="E-mail" className="w-full p-2 mt-2 text-white bg-[#374151] border border-white rounded" />
            <button type="submit" className="absolute right-1 top-[1.6rem] -translate-y-1/2 text-white">
              <img src="imagens/arrow-right.svg" alt="Submit"></img>
            </button>
          </div>
          <p className="mt-2">Siga-nos nas redes sociais</p>
          <div className="flex gap-3 mt-2 text-xl">
            <FontAwesomeIcon icon={faFacebook} />
            <FontAwesomeIcon icon={faInstagram} />
            <FontAwesomeIcon icon={faTwitter} />
            <FontAwesomeIcon icon={faYoutube} />
          </div>
        </FooterSection>
      </div>
      <div className="text-center text-base text-white md:mt-8 mt-2 border-t border-gray-600 py-[16px]">© Todos os direitos reservados</div>
    </footer>
  );
}

export default Footer;
