import React from 'react';
import {
    Alert,
  } from 'reactstrap';

export const API_URL = 'http://localhost:2018/WebApi';

export function makeRequestBody(body) {
    let formData = new URLSearchParams();

    for (var key in body) {
      formData.append(key, body[key]);
    }

    return formData;
};

export function authenticate() {
    return fetch(`${API_URL}/token`, {
        method: 'POST',
        body: makeRequestBody(
            {
                username: 'FEUP',
                password: 'qualquer1',
                company: 'MATESC',
                instance: 'DEFAULT',
                line: 'professional',
                grant_type: 'password'
            }
        ),
    });
}

/*export function makeHeaders(authentication) {
    return {
        'Authorization' : `Bearer ${authentication['access_token']}`,
        'Accept': 'application/json'
    };
}*/

export function makeHeaders(authentication) {
    return {
        'Authorization' : `Bearer ${authentication['access_token']}`,
        'Content-Type': 'application/json'
    };
}

export function unprocessedClientOrdersFetch(authentication){
    return fetch(`${API_URL}/Administrador/Consulta`, {
        method: 'POST',
        headers: makeHeaders(authentication),
        body:JSON.stringify("SELECT CONCAT(CD.Serie, CD.NumDoc) as OrderId, CD.Entidade, CD.Nome, CD.Data, CDS.Estado FROM CabecDoc CD INNER JOIN CabecDocStatus CDS ON CDS.IdCabecDoc = CD.Id AND CD.TipoDoc = 'ECL' AND CDS.Anulado = 'false' AND CDS.Fechado = 'false' AND CDS.Estado = 'P'")
    });
}

export function unprocessedSuppliersOrdersFetch(authentication){
    return fetch(`${API_URL}/Administrador/Consulta`, {
        method: 'POST',
        headers: makeHeaders(authentication),
        body:JSON.stringify("SELECT CONCAT(CC.Serie, CC.NumDoc) as OrderId, CC.Entidade, CC.Nome, CC.DataDoc, CCS.Estado FROM CabecCompras CC INNER JOIN CabecComprasStatus CCS ON CCS.IdCabecCompras = CC.Id AND CC.TipoDoc = 'ECF' AND CCS.Anulado = 'false' AND CCS.Fechado = 'false' AND CCS.Estado = 'P'"
        )
    });
}

export async function supplierOrderInfoContent(authentication, Doc_Serie, Doc_Number){
    return fetch(`${API_URL}/Administrador/Consulta`, {
        method: 'POST',
        headers: makeHeaders(authentication),
        body:JSON.stringify(`SELECT CONCAT(CC.Serie, CC.NumDoc) as OrderId, CC.DataDoc, CC.Nome, CC.Entidade, SUM(LC.PrecUnit*LC.Quantidade + LC.TotalIva) as PrecoTotal FROM LinhasCompras LC INNER JOIN CabecCompras CC ON LC.IdCabecCompras = CC.Id WHERE CC.Serie = '${Doc_Serie}' AND CC.NumDoc = ${Doc_Number} AND CC.TipoDoc = 'ECF' GROUP BY CC.DataDoc, CC.Nome, CC.Entidade, CC.Id, CC.Serie, CC.NumDoc`
        )
    });
}

export function supplierOrderContent(authentication, Doc_Serie, Doc_Number){
    return fetch(`${API_URL}/Administrador/Consulta`, {
        method: 'POST',
        headers: makeHeaders(authentication),
        body:JSON.stringify(`SELECT ArmazemLocalizacoes.Descricao as DescricaoLocalizacao, Artigos.* FROM ArmazemLocalizacoes INNER JOIN (SELECT ArtigosLinhas.*, (Artigo.Peso * ArtigosLinhas.Quantidade) as PesoTotal, (Artigo.Volume * ArtigosLinhas.Quantidade) as VolumeTotal, Artigo.Peso as PesoUnit, Artigo.Volume as VolumeUnit FROM Artigo INNER JOIN (SELECT LC.Artigo, LC.Descricao, LC.Localizacao, LC.Quantidade FROM LinhasCompras LC INNER JOIN CabecCompras CC ON LC.IdCabecCompras = CC.Id WHERE CC.Serie = '${Doc_Serie}' AND CC.NumDoc = ${Doc_Number} AND CC.TipoDoc = 'ECF') as ArtigosLinhas ON ArtigosLinhas.Artigo = Artigo.Artigo) as Artigos ON ArmazemLocalizacoes.Localizacao = Artigos.Localizacao`
        )
    });
}

export async function clientOrderInfoContent(authentication, Doc_Serie, Doc_Number){
    return fetch(`${API_URL}/Administrador/Consulta`, {
        method: 'POST',
        headers: makeHeaders(authentication),
        body:JSON.stringify(`SELECT CONCAT(CD.Serie, CD.NumDoc) as OrderId, CD.Data, CD.Nome, CD.Entidade, SUM(LD.PrecUnit*LD.Quantidade + LD.TotalIva) as PrecoTotal FROM LinhasDoc LD INNER JOIN CabecDoc CD ON LD.IdCabecDoc = CD.Id WHERE CD.Serie = '${Doc_Serie}' AND CD.NumDoc = ${Doc_Number} AND CD.TipoDoc = 'ECL' GROUP BY CD.Data, CD.Nome, CD.Entidade, CD.Id, CD.Serie, CD.NumDoc`
        )
    });
}

export function clientOrderContent(authentication, Doc_Serie, Doc_Number){
    return fetch(`${API_URL}/Administrador/Consulta`, {
        method: 'POST',
        headers: makeHeaders(authentication),
        body:JSON.stringify(`SELECT ArmazemLocalizacoes.Descricao as DescricaoLocalizacao, Artigos.* FROM ArmazemLocalizacoes INNER JOIN (SELECT ArtigosLinhas.*, (Artigo.Peso * ArtigosLinhas.Quantidade) as PesoTotal, (Artigo.Volume * ArtigosLinhas.Quantidade) as VolumeTotal, Artigo.Peso as PesoUnit, Artigo.Volume as VolumeUnit FROM Artigo INNER JOIN (SELECT LD.Artigo, LD.Descricao, LD.Localizacao, LD.Quantidade FROM LinhasDoc LD INNER JOIN CabecDoc CD ON LD.IdCabecDoc = CD.Id WHERE CD.Serie = '${Doc_Serie}' AND CD.NumDoc = ${Doc_Number} AND CD.TipoDoc = 'ECL') as ArtigosLinhas ON ArtigosLinhas.Artigo = Artigo.Artigo) as Artigos ON ArmazemLocalizacoes.Localizacao = Artigos.Localizacao`
        )
    });
}

export function itemsInStock(authentication){
    return fetch(`${API_URL}/Administrador/Consulta`, {
        method: 'POST',
        headers: makeHeaders(authentication),
        body:JSON.stringify(`SELECT ArmazemLocalizacoes.Descricao as DescricaoLocalizacao, ArtigoArmazem.* FROM ArmazemLocalizacoes INNER JOIN (SELECT Inv.Artigo, A.Descricao as Nome, Inv.Localizacao as Localizacao, ISNULL(Inv.StkActual, 0) AS StkActual FROM V_INV_ArtigoArmazem Inv INNER JOIN Artigo A ON Inv.Artigo = A.Artigo WHERE Inv.StkActual IS NOT NULL AND Inv.StkActual > 0) as ArtigoArmazem ON ArmazemLocalizacoes.Localizacao = ArtigoArmazem.Localizacao`
        )
    });
}

export function itemsOutOfStock(authentication){
    return fetch(`${API_URL}/Administrador/Consulta`, {
        method: 'POST',
        headers: makeHeaders(authentication),
        body:JSON.stringify(`SELECT ArmazemLocalizacoes.Descricao as DescricaoLocalizacao, ArtigoArmazem.* FROM ArmazemLocalizacoes INNER JOIN (SELECT Inv.Artigo, A.Descricao as Nome, Inv.Localizacao as Localizacao, ISNULL(Inv.StkActual, 0) AS StkActual FROM V_INV_ArtigoArmazem Inv INNER JOIN Artigo A ON Inv.Artigo = A.Artigo WHERE Inv.StkActual IS NULL OR Inv.StkActual = 0) as ArtigoArmazem ON ArmazemLocalizacoes.Localizacao = ArtigoArmazem.Localizacao`
        )
    });
}


export function errorMessage(error){
    if(error){
        return(
            <Alert color = "danger"> Erro do Primavera</Alert>
        )
    }
}



export function loadItems(authentication) {
    return fetch(`${API_URL}/Base/Artigos/LstArtigos`, {
        headers: makeHeaders(authentication)
    });
}


export function query(authentication, query) {
    return fetch(`${API_URL}/Administrador/Consulta`, {
        method:'POST',
        headers: makeHeaders(authentication),
        body: `${query}`
    });
}

export function getUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
      vars[key] = value;
    });
    return vars;
  }