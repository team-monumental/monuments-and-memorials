package com.monumental;

import org.hibernate.QueryException;
import org.hibernate.dialect.function.SQLFunction;
import org.hibernate.engine.spi.Mapping;
import org.hibernate.engine.spi.SessionFactoryImplementor;
import org.hibernate.type.BooleanType;
import org.hibernate.type.Type;

import java.util.List;

/**
 * This function allows us to leverage Postgres's FTS (Full Text Search) from within Hibernate.
 * https://www.zymr.com/postgresql-full-text-searchfts-hibernate/
 */
public class FTSFunction implements SQLFunction {

    @Override
    public String render(Type firstArgumentType, List args, SessionFactoryImplementor factory) {
        if (args == null || args.size() != 2) {
            throw new IllegalArgumentException("The function must be passed exactly 2 arguments");
        }

        String field = (String) args.get(0);
        String value = (String) args.get(1);
        return "to_tsvector(" + field + ") @@ " + "plainto_tsquery(" + value + ")";
    }

    @Override
    public boolean hasArguments() {
        return true;
    }

    @Override
    public boolean hasParenthesesIfNoArguments() {
        return false;
    }

    @Override
    public Type getReturnType(final Type firstArgumentType, final Mapping mapping) throws QueryException {
        return new BooleanType();
    }
}
